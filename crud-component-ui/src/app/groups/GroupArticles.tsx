import { useEffect, useState } from "react";
import { articleService } from "../articles/article.service";
import type { Article } from "../articles/article.types";

interface GroupArticlesProps {
  groupId: string;
}

// Detail side of the group → articles master-detail: lists the articles assigned to one group.
export const GroupArticles = ({ groupId }: GroupArticlesProps) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    articleService
      .getAll({
        filter: { values: { groupId } },
        sort: { field: "catalogNumber", direction: "asc" },
      })
      .then((result) => {
        if (active) {
          setArticles(result.data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Greška pri učitavanju artikala");
        }
      });
    return () => {
      active = false;
    };
  }, [groupId]);

  if (error) {
    return <span className="text-red-600">{error}</span>;
  }
  if (!articles) {
    return <span className="text-gray-500">Učitavanje...</span>;
  }
  if (articles.length === 0) {
    return <span className="text-gray-500">Grupa nema artikala.</span>;
  }

  return (
    <div className="mt-1 overflow-x-auto rounded-md border border-gray-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
            <th className="px-3 py-2 font-medium">Kataloški broj</th>
            <th className="px-3 py-2 font-medium">Naziv</th>
            <th className="px-3 py-2 font-medium">Proizvođač</th>
            <th className="px-3 py-2 font-medium">Lokacija</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-gray-100 last:border-0">
              <td className="px-3 py-2 whitespace-nowrap">{article.catalogNumber}</td>
              <td className="px-3 py-2">{article.name}</td>
              <td className="px-3 py-2">{article.manufacturer}</td>
              <td className="px-3 py-2">{article.shelfLocation || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

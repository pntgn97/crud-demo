# CLAUDE.md — kontekst projekta

Ovaj repozitorijum je praktični dio diplomskog rada **"Razvoj univerzalne komponente za CRUD operacije u React aplikacijama"**. Tekst rada se piše odvojeno (u Claude.ai projektu); ovdje se radi samo implementacija. Dogovoreni domen i obim su fiksni — ne proširivati ih bez izričitog dogovora sa korisnikom.

## Pravila rada

- `crud-component-ui/src/crud-component/` mora ostati **potpuno generička** — u njoj ne smije biti nijednog reda koda vezanog za konkretan domen (artikli, ulazi…). Sve domensko ide u `src/app/`.
- Komponenta se prilagođava kroz konfiguraciju (`EntityConfig`, `FieldConfig`) i proširenja (`render`, `renderInput`, `validate`). Nova mogućnost komponente se dodaje samo ako je opšta i korisna za bilo koji domen.
- Tekst u korisničkom interfejsu: srpski jezik, ijekavica, latinica.
- TypeScript strogo tipiziran, bez `any` gdje god je moguće.
- Raditi u malim koracima; nakon svakog zadatka provjeriti `npm run build` i `npm run lint` u `crud-component-ui/`, i predložiti poruku za commit.
- Kad nešto nije jasno (npr. naziv polja, ponašanje), pitati umjesto pretpostavljati.

## Plan implementacije (redoslijed)

1. **Zatvaranje forme tek nakon uspješne operacije.** U `CrudComponent` se modal za dodavanje/izmjenu sada zatvara odmah nakon poziva `create`/`update`, pa se pri grešci servera gubi unos. `create`/`update`/`remove` u `useCrud` treba da signaliziraju uspjeh (npr. vrate `boolean`), a modal se zatvara samo ako je operacija uspjela; greška se prikazuje korisniku.
2. **Dosljedna podrška za `idField`.** `EntityConfig.idField` se trenutno koristi samo za React ključeve, dok `useCrud` i `CrudComponent` pretpostavljaju polje `id` (`T extends { id: string | number }`). Identifikator svuda čitati preko `idField` (potrebno jer artikli imaju kataloški broj kao prirodni identifikator).
3. **Filtriranje / pretraga u komponenti.** Opšti mehanizam: pretraga po tekstu i filtriranje po vrijednostima polja (npr. select). Prvo provjeriti šta podržava json-server v1 (verzija iz `crud-component-mock-api/package.json`) i zajedno sa korisnikom odlučiti da li filtrirati na serveru ili na klijentu. Proširiti `GetAllOptions`, `CrudService`, `restCrudService`, `useCrud` i UI.
4. **Prelazak na domen skladišta autodijelova** (vidi sekciju ispod): tipovi, konfiguracije, servisi i stranice u `src/app/`, rute i navigacija u `App.tsx`, novi `db.json` sa realističnim primjerima podataka. Ukloniti stari domen prodavnice (kategorije, proizvodi, narudžbe). Ulazi i izlazi su **dvije konfiguracije iste komponente**; editor stavki (artikl + količina) napraviti po uzoru na postojeći `OrderItems`.
5. **Izračunato stanje artikla.** Stanje = zbir količina iz ulaza − zbir iz izlaza; prikazati kao polje samo za čitanje i istaći artikle ispod minimalne zalihe (preko `render`).
6. **Validacija izlaza.** Količina u stavci izlaza ne smije preći trenutno stanje artikla (provjera na klijentu; napomena: pouzdano bi bilo tek na serveru).
7. **Testovi.** Dodati Vitest + React Testing Library i napisati testove za ključne dijelove komponente (validacija u `EntityForm`, logika sortiranja/paginacije u `useCrud`, prikaz kolona u `DataTable`, filtriranje).

## Praktični dio — repozitorijum i tehnologije

**Repozitorijum (javni):** https://github.com/pntgn97/crud-demo

Na početku rada na Glavi 5 (ili bilo čemu vezanom za kod), Claude treba klonirati repozitorijum kako bi imao uvid u najnoviju verziju koda.

**Struktura repozitorijuma:**
- `crud-component-ui/` — frontend aplikacija sa univerzalnom CRUD komponentom (`src/crud-component/`) i primjerom njene upotrebe (`src/app/` — entiteti: kategorije, proizvodi, narudžbe sa stavkama).
- `crud-component-mock-api/` — json-server (port 3005, podaci u `db.json`) koji služi isključivo za simulaciju REST API-ja.

**Tehnologije (prema `package.json`):** React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router; za mock API json-server.

**Napomena:** Upravljanje stanjem i komunikacija sa serverom realizovani su vlastitim hookom `useCrud` i apstrakcijom `CrudService` (`createRestCrudService` nad Axiosom), a forme vlastitom komponentom `EntityForm` — **ne koriste se** React Query ni React Hook Form. React Query se u radu obrađuje samo teorijski (3.3.3).

**Planirano u kodu (još nije implementirano):**
- Filtriranje podataka u tabelarnom prikazu — trenutno komponenta podržava samo sortiranje i paginaciju. Pri pisanju 5.3.2 i 5.4 prvo provjeriti u repozitorijumu da li je filtriranje u međuvremenu dodato, i opisivati samo ono što je stvarno implementirano.

## Domen primjera aplikacije (za 5.8)

**Dogovoreno:** aplikacija za vođenje skladišta autodijelova. Postojeći primjer u repozitorijumu (prodavnica: kategorije, proizvodi, narudžbe) treba zamijeniti ovim domenom. Izmjene se odnose na `src/app/` i `db.json`; sama komponenta (`src/crud-component/`) se mijenja samo ondje gdje su potrebna nova proširenja (npr. filtriranje).

**Entiteti:**
- **Grupe artikala** — npr. kočioni sistem, filteri, ovjes, elektrika, ulja i tečnosti. Artikli se dodjeljuju grupi (prirodan master-detail: grupa → artikli).
- **Artikli** — kataloški broj (šifra, prirodni identifikator), naziv, proizvođač, jedinica mjere (kom, set, litar), grupa, lokacija na polici, minimalna zaliha. Stanje se **ne unosi**, nego se izračunava iz ulaza i izlaza (samo za čitanje); artikli ispod minimalne zalihe se ističu.
- **Partneri** — samo **dobavljači** (od kojih se roba kupuje).
- **Ulazi** — datum, dobavljač, broj fakture, stavke (artikl + količina).
- **Izlazi** — datum, broj fakture, stavke (artikl + količina). Kupci se ne evidentiraju.

**Bez novca:** aplikacija vodi samo količine; nema cijena, iznosa, PDV-a ni plaćanja. Broj fakture je samo referenca na dokument.

**Van obima (kandidati za 5.9):** evidencija kupaca, narudžbenice, cijene i vrijednost zaliha, više skladišta, kompatibilnost dijelova sa vozilima (eventualno samo tekstualno polje "Odgovara za").

**Posljedice za komponentu:** filtriranje/pretraga (po kataloškom broju, nazivu, grupi) postaje osnovna funkcija, a ne dodatak; `idField` treba dosljedno podržati (kataloški broj); validacija izlaza (količina ne smije preći stanje) i jedinstvenosti broja fakture — pouzdano samo na serveru, dobra tema za 5.7 uz 4.2.2.

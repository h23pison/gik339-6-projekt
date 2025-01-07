/* Importera npm-paket sqlite3 med hjälp av require() och lagrar i variabeln sqlite */
const sqlite = require('sqlite3').verbose();
/* Skapar ny koppling till databas-fil som skapades tidigare. */
const db = new sqlite.Database('./gik339.db');

/* Importerar npm-paket express och lagrar i variabeln express */
const express = require('express');
/* Skapar server med hjälp av express */
const server = express();

/* Sätter konfiguration på servern */
server
  /* Data ska kommuniceras i JSON-format */
  .use(express.json())
  /* Sättet som data ska kodas och avkodas på */
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    /* Headers för alla förfrågningar. Hanterar regler för CORS (vilka klienter som får anropa vår server och hur.) */
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    /* Säger åt servern att fortsätta processa förfrågan */
    next();
  });

/* Startar servern på port 3000 */
server.listen(3000, () => {
  /* Meddelande för feedback att servern körs */
  console.log('Server running on http://localhost:3000');
});

/* Hantering av GET-requests till endpointen /countries */
server.get('/countries', (req, res) => {
  /* sql-query för att hämta alla countries ur databasen. */
  const sql = 'SELECT * FROM countries';
  /* Anrop till db-objektets funktion .all som används till att hämta upp rader ur en tabell */
  db.all(sql, (err, rows) => {
    /* Callbackfunktionen har parametern err för att lagra eventuella fel */
    if (err) {
      /* Om det finns något i det objektet skickar vi ett svar tillbaka att något gick fel (status 500) och info om vad som gick fel (innehållet i objektet err) */
      res.status(500).send(err);
    } else {
      /* Annars, om allt gick bra, skickar vi de rader som hämtades upp.  */
      res.send(rows);
    }
  });
});

server.get('/countries/:id', (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM countries WHERE id=${id}`;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows[0]);
    }
  });
});

server.post('/countries', (req, res) => {
  const country = req.body;
  const sql = `INSERT INTO countries(country, capital, language, continent) VALUES (?,?,?,?)`;

  db.run(sql, Object.values(country), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send('Landet sparades');
    }
  });
});

server.put('/countries', (req, res) => {
  const bodyData = req.body;

  const id = bodyData.id;
  const country = {
    country: bodyData.country,
    capital: bodyData.capital,
    language: bodyData.language,
    continent: bodyData.continent
  };

  let updateString = '';
  const columnsArray = Object.keys(country);
  columnsArray.forEach((column, i) => {
    updateString += `${column}="${country[column]}"`;
    if (i !== columnsArray.length - 1) updateString += ',';
  });
  const sql = `UPDATE countries SET ${updateString} WHERE id=${id}`;

  db.run(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send('Landet uppdaterades');
    }
  });
  //UPDATE countries SET firstName="Mikaela",lastName="Hedberg" WHERE id=1
});

server.delete('/countries/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM countries WHERE id = ${id}`;

  db.run(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send('Landet borttagen');
    }
  });
});
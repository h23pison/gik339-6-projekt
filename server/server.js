/* Importerar sqlite3 för att vi ska kunna arbeta med SQLite-databas, 
importerar express för att skapa webserver med: */
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./gik339.db');

const express = require('express');

const server = express();

/* Sätter konfiguration på servern, ser till att data kommuniceras i JSON-format */
server
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');

    next();
  });

/* Startar servern på port 3001 */
server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

/*Sätter hur GET-requests hanteras för endpointen /countries, sql-query för att hämta ur databasen: */ 
server.get('/countries', (req, res) => {
  const sql = 'SELECT * FROM countries';
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err); // Om någonting går fel, alltså om det finns något i objekter err
    } else {
      res.send(rows); // Om allt gick bra skickas alla rader i rows
    }
  });
});

/*Sätter hur GET-requests hanteras för endpointen /countries:id, sql-query för att hämta ur databasen: */ 
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

/* Sätter hur förfrågningar för endpointen /countries ska hanteras, 
används för att lägga till ett nytt land i databasen: */
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

/* Sätter hur vi uppdaterar ett land som ligger i databasen: */
server.put('/countries', (req, res) => {
  const bodyData = req.body;

  const id = bodyData.id; // hämtar id:t för det land som ska uppdateras
  /* Sätter de nya värdena för landet: */
  const country = {
    country: bodyData.country,
    capital: bodyData.capital,
    language: bodyData.language,
    continent: bodyData.continent
  };

  let updateString = '';
  const columnsArray = Object.keys(country);
  /* Lägger till det nya värdet för varje kolumn: */
  columnsArray.forEach((column, i) => {
    updateString += `${column}="${country[column]}"`;
    if (i !== columnsArray.length - 1) updateString += ',';
  });
  /* Skapar och kör en SQL-förfrågan för att uppdatera landet med det valda id:t: */
  const sql = `UPDATE countries SET ${updateString} WHERE id=${id}`;
  db.run(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send('Landet uppdaterades');
    }
  });
});

/* Sätter hur vi tar bort ett land ur databasen m.h.a. inhämtat id och en SQL-förfrågan för att
ta bort landet med det valda id:t:  */
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
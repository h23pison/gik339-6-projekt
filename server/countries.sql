DROP TABLE IF EXISTS countries;
CREATE TABLE IF NOT EXISTS countries(
   id        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT
  ,country VARCHAR(8) NOT NULL
  ,capital  VARCHAR(9) NOT NULL
  ,language  VARCHAR(16) NOT NULL
  ,continent     VARCHAR(6) NOT NULL
);
INSERT INTO countries(country, capital, language, continent) VALUES ('Sweden', 'Stockholm', 'Swedish', 'Europe');
INSERT INTO countries(country, capital, language, continent) VALUES ('USA', 'Washington, D.C.', 'English', 'North America');
INSERT INTO countries(country, capital, language, continent) VALUES ('Russia', 'Moscow', 'Russian', 'Europe/Asia');
INSERT INTO countries(country, capital, language, continent) VALUES ('Germany', 'Berlin', 'German', 'Europe');
INSERT INTO countries(country, capital, language, continent) VALUES ('France', 'Paris', 'French', 'Europe');
INSERT INTO countries(country, capital, language, continent) VALUES ('Spain', 'Madrid', 'Spanish', 'Europe');
INSERT INTO countries(country, capital, language, continent) VALUES ('China', 'Beijing', 'Mandarin', 'Asia');
INSERT INTO countries(country, capital, language, continent) VALUES ('Norway', 'Oslo', 'Norwegian', 'Europe');
INSERT INTO countries(country, capital, language, continent) VALUES ('India', 'New Delhi', 'Hindi', 'Asia');
INSERT INTO countries(country, capital, language, continent) VALUES ('Somalia', 'Mogadishu', 'Somali', 'Africa');
INSERT INTO countries(country, capital, language, continent) VALUES ('Uganda', 'Kampala', 'English', 'Africa');
INSERT INTO countries(country, capital, language, continent) VALUES ('Japan', 'Tokyo', 'Japanese', 'Asia');
INSERT INTO countries(country, capital, language, continent) VALUES ('Brazil', 'Brasília', 'Portuguese', 'South America');
INSERT INTO countries(country, capital, language, continent) VALUES ('Australia', 'Canberra', 'English', 'Oceania');


select * from countries;
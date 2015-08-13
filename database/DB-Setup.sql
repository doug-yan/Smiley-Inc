CREATE DATABASE OriginateIdol;

DROP TABLE IF EXISTS Highscores;
DROP TABLE IF EXISTS Songs;

CREATE TABLE Songs (
  title VARCHAR(40),
  artist VARCHAR(40),
  difficulty SMALLINT,
  duration SMALLINT,
  genre VARCHAR(20),
  PRIMARY KEY(title, artist)
);

CREATE TABLE Highscores (
  userId CHAR(21) NOT NULL,
  name VARCHAR(75) NOT NULL,
  picture VARCHAR(150),
  title VARCHAR(40) NOT NULL,
  artist VARCHAR(40) NOT NULL,
  score INT,
  PRIMARY KEY (userId, title, artist),
  FOREIGN KEY (title, artist) REFERENCES Songs(title, artist)
);

INSERT INTO Songs VALUES
  ('The_Kill', '30_Seconds_to_Mars', 6, 243, 'Alternative'),
  ('Lose_Yourself', 'Eminem', 8, 317, 'Hip-hop'),
  ('Blank_Space', 'Taylor_Swift', 5, 231, 'Pop'),
  ('Shake_it_Off', 'Taylor_Swift', 4, 241, 'Pop'),
  ('Go_Your_Own_Way', 'Fleetwood_Mac', 3, 239, 'Rock'),
  ('Titanium', 'Sia', 6, , 'Pop';

INSERT INTO Highscores VALUES
  ('227463955755766435220', 'Test User1', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 839),
  ('098765432112345679934', 'Test User2', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 350),
  ('102938475685018599518', 'Test User3', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 753),
  ('564738291058175551825', 'Test User4', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 125),
  ('227463955755766435220', 'Test User1', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Lose_Yourself', 'Eminem', 359),
  ('227463955755766435220', 'Test User1', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Shake_it_Off', 'Taylor_Swift', 839),
  ('098765432112345679934', 'Test User2', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Blank_Space', 'Taylor_Swift', 525),
  ('098765432112345679934', 'Test User2', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Lose_Yourself', 'Eminem', 745);

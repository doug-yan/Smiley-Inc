CREATE DATABASE OriginateIdol;

CREATE TABLE Users (
  userId CHAR(10) primary key
);

CREATE TABLE Songs (
  title VARCHAR(40),
  artist VARCHAR(40),
  difficulty SMALLINT,
  duration SMALLINT,
  genre VARCHAR(20),
  PRIMARY KEY(title, artist)
);

CREATE TABLE Highscores (
  userId CHAR(10) NOT NULL,
  title VARCHAR(40) NOT NULL,
  artist VARCHAR(40) NOT NULL,
  score INT,
  PRIMARY KEY (userId, title, artist),
  FOREIGN KEY (title, artist) REFERENCES Songs(title, artist),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);

INSERT INTO Users VALUES
  ('1234567890'), ('0987654321'), ('1029384756'), ('5647382910'), ('9999999999');

INSERT INTO Songs VALUES
  ('The_Kill', '30_Seconds_to_Mars', 6, 243, 'Alternative'),
  ('Lose_Yourself', 'Eminem', 8, 317, 'Hip-hop'),
  ('Blank_Space', 'Taylor_Swift', 5, 231, 'Pop'),
  ('Shake_it_Off', 'Taylor_Swift', 4, 241, 'Pop');

INSERT INTO Highscores VALUES
  ('1234567890', 'The_Kill', '30_Seconds_to_Mars', 839),
  ('0987654321', 'The_Kill', '30_Seconds_to_Mars', 350),
  ('1029384756', 'The_Kill', '30_Seconds_to_Mars', 753),
  ('5647382910', 'The_Kill', '30_Seconds_to_Mars', 125),
  ('1234567890', 'Lose_Yourself', 'Eminem', 359),
  ('1234567890', 'Shake_it_Off', 'Taylor_Swift', 839),
  ('0987654321', 'Blank_Space', 'Taylor_Swift', 525),
  ('0987654321', 'Lose_Yourself', 'Eminem', 745);

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
  ('Go_Your_Own_Way', 'Fleetwood_Mac', 3, 239, 'Rock');

INSERT INTO Highscores VALUES
  ('227463955755766435220', 'Test User1', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 839),
  ('098765432112345679934', 'Test User2', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 350),
  ('102938475685018599518', 'Test User3', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 753),
  ('564738291058175551825', 'Test User4', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'The_Kill', '30_Seconds_to_Mars', 125),
  ('227463955755766435220', 'Test User1', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Lose_Yourself', 'Eminem', 359),
  ('227463955755766435220', 'Test User1', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Shake_it_Off', 'Taylor_Swift', 839),
  ('098765432112345679934', 'Test User2', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Blank_Space', 'Taylor_Swift', 525),
  ('108860017285912231762', 'Tim Mendez', 'https://lh4.googleusercontent.com/-cIPKxUoSPYg/AAAAAAAAAAI/AAAAAAAAABk/tYVs2VPEnQM/s96-c/photo.jpg', 'Blank_Space', 'Taylor_Swift', 734),
  ('108860017285912231762', 'Tim Mendez', 'https://lh4.googleusercontent.com/-cIPKxUoSPYg/AAAAAAAAAAI/AAAAAAAAABk/tYVs2VPEnQM/s96-c/photo.jpg', 'The_Kill', '30_Seconds_to_Mars', 323),
  ('108860017285912231762', 'Tim Mendez', 'https://lh4.googleusercontent.com/-cIPKxUoSPYg/AAAAAAAAAAI/AAAAAAAAABk/tYVs2VPEnQM/s96-c/photo.jpg', 'Lose_Yourself', 'Eminem', 467),
  ('108860017285912231762', 'Tim Mendez', 'https://lh4.googleusercontent.com/-cIPKxUoSPYg/AAAAAAAAAAI/AAAAAAAAABk/tYVs2VPEnQM/s96-c/photo.jpg', 'Go_Your_Own_Way', 'Fleetwood_Mac', 183),
  ('113637311310906071396', 'Stephanie Baum', 'https://lh4.googleusercontent.com/-UDqxVnO_yII/AAAAAAAAAAI/AAAAAAAAABY/0-Jsjm-b3eM/s96-c/photo.jpg', 'Go_Your_Own_Way', 'Fleetwood_Mac', 597),
  ('113637311310906071396', 'Stephanie Baum', 'https://lh4.googleusercontent.com/-UDqxVnO_yII/AAAAAAAAAAI/AAAAAAAAABY/0-Jsjm-b3eM/s96-c/photo.jpg', 'Blank_Space', 'Taylor_Swift', 852),
  ('113637311310906071396', 'Stephanie Baum', 'https://lh4.googleusercontent.com/-UDqxVnO_yII/AAAAAAAAAAI/AAAAAAAAABY/0-Jsjm-b3eM/s96-c/photo.jpg', 'Shake_it_Off', 'Taylor_Swift', 573),
  ('113637311310906071396', 'Stephanie Baum', 'https://lh4.googleusercontent.com/-UDqxVnO_yII/AAAAAAAAAAI/AAAAAAAAABY/0-Jsjm-b3eM/s96-c/photo.jpg', 'The_Kill', '30_Seconds_to_Mars', 296),
  ('113637311310906071396', 'Stephanie Baum', 'https://lh4.googleusercontent.com/-UDqxVnO_yII/AAAAAAAAAAI/AAAAAAAAABY/0-Jsjm-b3eM/s96-c/photo.jpg', 'Lose_Yourself', 'Eminem', 634),
  ('098765432112345679934', 'Test User2', 'http://s2.postimg.org/mlc6ck4x5/originate_Interns.png', 'Lose_Yourself', 'Eminem', 745);

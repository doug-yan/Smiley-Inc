UPDATE songs SET difficulty = 10 - (average/100)
FROM (SELECT title, artist, AVG(score) AS average FROM Highscores GROUP BY title, artist) AS avgs
WHERE avgs.title = songs.title AND avgs.artist = songs.artist;

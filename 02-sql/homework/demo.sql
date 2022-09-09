actors     directors_genres  movies_directors  roles
directors  movies            movies_genres

para saber propiedades con = .schema 

# 01 # Buscá todas las películas filmadas en el año que naciste.

SELECT * FROM movies WHERE year = 2001;

# 02 # Cuantas películas hay en la DB que sean del año 1982?

SELECT COUNT(*) as Total FROM movies WHERE year = 1982;

# 03 # Buscá actores que tengan el substring stack en su apellido.

SELECT * FROM actors WHERE last_name LIKE '%stack%';

# 04 # Buscá los 10 nombres y apellidos más populares entre los actores. Cuantos actores tienen cada uno de esos nombres y apellidos?

.schema actors

SELECT first_name, last_name, COUNT(*) as Total
FROM actors
GROUP BY LOWER(first_name), LOWER(last_name)
ORDER BY total DESC
LIMIT 10;

# 05 # Listá el top 100 de actores más activos junto con el número de roles que haya realizado.

.schema actors
.schema roles

SELECT a.first_name, a.last_name, COUNT(*) as Total
FROM actors as a
join roles as r
on a.id = r.actor_id
GROUP BY a.id
ORDER BY Total DESC
LIMIT 100;

# 06 # Cuantas películas tiene IMDB por género? Ordená la lista por el género menos popular.

SELECT genre, COUNT(*) as Total
FROM movies_genres
GROUP BY genre
ORDER BY Total;

# 07 # Listá el nombre y apellido de todos los actores que trabajaron en la película "Braveheart" de 1995, ordená la lista alfabéticamente por apellido.

SELECT a.first_name, a.last_name
FROM actors as a 
join roles as r on a.id = r.actor_id
join movies as m on r.movie_id = m.id
WHERE m.name = 'Braveheart' and m.year = 1995
ORDER BY a.last_name, a.first_name;

# 08 # Listá todos los directores que dirigieron una película de género 'Film-Noir' en un año bisiesto (para reducir la complejidad, asumí que cualquier año divisible por cuatro es bisiesto). Tu consulta debería devolver el nombre del director, el nombre de la peli y el año. Todo ordenado por el nombre de la película.

SELECT d.first_name, d.last_name, m.name, m.year 
FROM directors as d 
join movies_directors as md on d.id = md.director_id
join movies as m on m.id = md.movie_id 
join movies_genres as mg on m.id = mg.movie_id 
WHERE mg.genre = 'Film-Noir' and m.year % 4 = 0
ORDER BY m.name;

# 09 # Listá todos los actores que hayan trabajado con Kevin Bacon en películas de Drama (incluí el título de la peli). Excluí al señor Bacon de los resultados.

SELECT a.first_name, a.last_name
FROM actors as a 
join roles as r on r.actor_id = a.id 
join movies as m on m.id = r.movie_id
join movies_genres as mg on mg.movie_id =m.id
WHERE mg.genre = 'Drama' and m.id IN (
    SELECT r.movie_id
    FROM roles as r 
    join actors as a on r.actor_id = a.id 
    WHERE first_name = 'Kevin' and last_name = 'Bacon'
)
and ( a.first_name || ' ' || a.last_name != 'Kevin Bacon');

# 10 # Qué actores actuaron en una película antes de 1900 y también en una película después del 2000?

SELECT *
FROM actors
WHERE id IN (
    SELECT r.actor_id
    FROM roles as r 
    join movies as m on r.movie_id = m.id
    WHERE m.year < 1900
) and
id IN (
    SELECT r.actor_id
    FROM roles as r 
    join movies as m on r.movie_id = m.id
    WHERE m.year > 2000
);

# 11 # Buscá actores que actuaron en cinco o más roles en la misma película después del año 1990. Noten que los ROLES pueden tener duplicados ocasionales, sobre los cuales no estamos interesados: queremos actores que hayan tenido cinco o más roles DISTINTOS (DISTINCT cough cough) en la misma película. Escribí un query que retorne los nombres del actor, el título de la película y el número de roles (siempre debería ser > 5).

SELECT a.first_name, a.last_name, COUNT(DISTINCT(r.role)) as Total
FROM actors as a 
join roles as r on a.id = r.actor_id
join movies as m on m.id = r.movie_id
WHERE m.year > 1990
GROUP BY r.movie_id, r.actor_id
having Total > 5;

# 12 # Para cada año, contá el número de películas en ese años que sólo tuvieron actrices femeninas.

SELECT r.movie_id
FROM roles as r
join actors as a on r.actor_id = a.id
WHERE a.genre = 'M'

SELECT year, COUNT(DISTINCT id)
FROM movies WHERE
id NOT IN(
    SELECT r.movie_id
    FROM roles as r 
    join actors as a on r.actor_id = a.id
    WHERE a.gender = 'M'
)
GROUP BY year;
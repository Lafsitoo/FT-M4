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

SELECT first_name, last_name, COUNT(*) as Total FROM actors
GROUP BY LOWER(first_name), LOWER(last_name)
ORDER BY total DESC
LIMIT 10;

# 05 # Listá el top 100 de actores más activos junto con el número de roles que haya realizado.


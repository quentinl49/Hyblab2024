const util = require('util');
const sqlite3 = require('sqlite3');
const path = require('path');
const dbname = path.join(__dirname, 'beaujoire-2.db');
const fs = require("fs");

const exists = fs.existsSync(dbname);
// Ouverture de la base de données
let db = new sqlite3.Database(dbname, err => {
    if (err) throw err;
    console.log('Database started: ' + dbname);
});

db.serialize(() => {
    if (!exists) {
        db.exec(`
            DROP TABLE IF EXISTS Nationalités;
            CREATE TABLE Nationalités(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nationalité VARCHAR(50),
                abreviation VARCHAR(3),
                drapeau BLOB    
            );

            DROP TABLE IF EXISTS Postes;
            CREATE TABLE Postes(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                poste VARCHAR(25)
            );

            DROP TABLE IF EXISTS Joueurs;
            CREATE TABLE Joueurs(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom VARCHAR(50),
                prenom VARCHAR(50),
                age TINYINT,
                naissance DATETIME,
                nationalité1 TINYINT,
                nationalité2 TINYINT,
                poste TINYINT,
                annéeDébut SMALLINT,
                annéeFin SMALLINT,
                selections SMALLINT,
                buts SMALLINT,
                arrets SMALLINT,
                photo BLOB,
                citation VARCHAR(255),
                biographie TEXT,
                FOREIGN KEY(nationalité1) REFERENCES Nationalités(id),
                FOREIGN KEY(nationalité2) REFERENCES Nationalités(id),
                FOREIGN KEY(poste) REFERENCES Postes(id)
            );

            DROP TABLE IF EXISTS Articles;
            CREATE TABLE Articles(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article BLOB
            );

            DROP TABLE IF EXISTS JoueursArticles;
            CREATE TABLE JoueursArticles(
                id_joueur INTEGER,
                id_article INTEGER,
                PRIMARY KEY (id_joueur, id_article),
                FOREIGN KEY (id_joueur) REFERENCES Joueurs(id),
                FOREIGN KEY (id_article ) REFERENCES Articles(id)
            );

            DROP TABLE IF EXISTS Photos;
            CREATE TABLE Photos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                photo BLOB
            );

            DROP TABLE IF EXISTS JoueursPhotos;
            CREATE TABLE JoueursPhotos(
                id_joueur INTEGER,
                id_photo INTEGER,
                PRIMARY KEY (id_joueur, id_photo),
                FOREIGN KEY (id_joueur) REFERENCES Joueurs(id),
                FOREIGN KEY (id_photo) REFERENCES Photos(id)
            );

            DROP TABLE IF EXISTS Vidéos;
            CREATE TABLE Vidéos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vidéo BLOB
            );

            DROP TABLE IF EXISTS JoueursVidéos;
            CREATE TABLE JoueursVidéos(
                id_joueur INTEGER,
                id_vidéo INTEGER,
                PRIMARY KEY (id_joueur, id_vidéo),  
                FOREIGN KEY (id_joueur) REFERENCES Joueurs(id),
                FOREIGN KEY (id_vidéo) REFERENCES Vidéos(id)
            );

            DROP TABLE IF EXISTS Votes;
            CREATE TABLE Votes(
                token VARCHAR(50) PRIMARY KEY,
                poste1 TINYINT,
                poste2 TINYINT,
                poste3 TINYINT,
                poste4 TINYINT,
                poste5 TINYINT,
                poste6 TINYINT,
                poste7 TINYINT,
                poste8 TINYINT,
                poste9 TINYINT,
                poste10 TINYINT,
                poste11 TINYINT,
                poste12 TINYINT,
                FOREIGN KEY (poste1) REFERENCES Joueurs(id),
                FOREIGN KEY (poste2) REFERENCES Joueurs(id),
                FOREIGN KEY (poste3) REFERENCES Joueurs(id),
                FOREIGN KEY (poste4) REFERENCES Joueurs(id),
                FOREIGN KEY (poste5) REFERENCES Joueurs(id),
                FOREIGN KEY (poste6) REFERENCES Joueurs(id),
                FOREIGN KEY (poste7) REFERENCES Joueurs(id),
                FOREIGN KEY (poste8) REFERENCES Joueurs(id),
                FOREIGN KEY (poste9) REFERENCES Joueurs(id),
                FOREIGN KEY (poste10) REFERENCES Joueurs(id),
                FOREIGN KEY (poste11) REFERENCES Joueurs(id),
                FOREIGN KEY (poste12) REFERENCES Joueurs(id)
            );
        `);
        db.run(`
            INSERT INTO Postes(poste) VALUES 
                ('Gardien'),
                ('Arrière latéral droit'),
                ('Arriere latéral gauche'),
                ('Défenseur central 1'),
                ('Défenseur central 2'),
                ('Milieu défensif'),
                ('Milieu gauche'),
                ('Milieu offensif'),
                ('Attaquant 1'),
                ('Milieu droit'),
                ('Attaquant 2'),
                ('Sélectionneur')
        `);
        db.run(`
        INSERT OR IGNORE INTO Nationalités(nationalité) VALUES 
        ('Français'),
        ('Nigérian'),
        ('Camerounais');
        `);

        db.run(`
        INSERT INTO Joueurs(nom, prenom, age, naissance, nationalité1, nationalité2, poste, AnnéeDébut, AnnéeFin, selections, buts, photo, citation, biographie)
        VALUES 
        ('Makélélé', 'Claude', 50, '1973-02-18', (SELECT id FROM Nationalités WHERE nationalité = 'Français'), NULL, 7, 1992, 1997, 207, 12, NULL, 'lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'),
        ('Vahirua', 'Marama', 43, '1980-05-12', (SELECT id FROM Nationalités WHERE nationalité = 'Français'), NULL, 7, 1997, 2004, 141, 41, NULL, 'lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'),
        ('Simon', 'Moses', 28, '1995-07-12', (SELECT id FROM Nationalités WHERE nationalité = 'Nigérian'), NULL, 7, 2019, NULL, 198, 33, NULL, 'lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'),
        ('Ganago', 'Ignatius', 24, '1999-02-16', (SELECT id FROM Nationalités WHERE nationalité = 'Camerounais'), NULL, 7, 2022, NULL, 48, 6, NULL, NULL, NULL);
        `);
    }
    db.all('SELECT * FROM Joueurs', (err, rows) => {
        if (err) console.error(err.message);
        else console.log('Résultat de la sélection : ', rows)
    });
})

module.exports = db;
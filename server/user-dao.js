'use strict';

/* Data Access Object (DAO) module for accessing administrators/users */
const sqlite = require('sqlite3');

// Used to compare the hash of the password
const bcrypt = require('bcrypt');

// Open the database
const db = new sqlite.Database('surveys.db', (err) => {
    if (err) throw err;
});


exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            // DB error
            if(err)
                reject(err);
            // User not found
            else if (row === undefined)
                resolve(false);
            else {
                bcrypt.compare(password, row.password).then(result => {
                    // Password matches
                    if(result)
                        resolve({
                            id: row.id,
                            username: row.username,
                            name: row.name
                        });
                    // Password not matching
                    else
                        resolve(false);
                })
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            // DB error
            if (err)
                reject(err);
            // User not found
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
                const user = {
                    id: row.id,
                    username: row.username,
                    name: row.name
                };
                resolve(user);
            }
        });
    });
};
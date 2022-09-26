const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the db given their email input
 * @param {String} email users email
 * @return {Promise<{}>} promise to the user
 */

//GET THE EMAIL FROM THRE DB,else return null, plus error handling
const getUserWithEmail = function(email) {
  return pool
    .query(`
      SELECT *
      FROM users 
      WHERE email = $1;
      `, [email]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a user from db given their id
 * @param {string} id user id
 * @return {Promise<{}>} user promise
 */
const getUserWithId = function(id) {
  return pool
    .query(`
      SELECT *
      FROM users 
      WHERE id = $1;
      `, [id]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a user to db
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `, [user.name, user.email, user.password]
      )
      .then((result) => {
        if (result.rows[0]) {
          return Promise.resolve(result.rows[0]);
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  
  return pool
    .query(`
      SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;
      `, [guest_id, limit]
    )
    .then((result) => {
      if (result.rows) {
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });

  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options query options
 * @param {*} limit results limit
 * @return {Promise<[{}]>}  properties promise
 */
const getAllProperties = function(options, limit = 10) {
  
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.user_id}`);
    if (queryParams.length > 0) {
      queryString += ` AND `;
    } else {
      queryString += ` WHERE `;
    }
    queryString += `owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(Number(`${options.minimum_price_per_night}`));
    if (queryParams.length > 0) {
      queryString += ` AND `;
    } else {
      queryString += ` WHERE `;
    }
    queryString += `cost_per_night >= $${queryParams.length}`;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(Number(`${options.maximum_price_per_night}`));
    if (queryParams.length > 0) {
      queryString += ` AND `;
    } else {
      queryString += ` WHERE `;
    }
    queryString += `cost_per_night <= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

//add property info to new listing
  const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);

  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ]
  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14
    )
    RETURNING *;
  `
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addProperty = addProperty;

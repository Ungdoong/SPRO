/* jshint indent: 2 */
import crypto from "crypto"
import jwt from "jsonwebtoken"

module.exports = function (sequelize, DataTypes) {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    platform_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    auth: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'users'
  });

  users.hash = function(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, process.env.SECRET_KEY, 92412, 64, 'sha512', async (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            key.toString('base64')
          )
        }
      })
    })
  }

  users.prototype.verify = async function(password) {
    const hash = await users.hash(password);
    return this.dataValues.password === hash;
  };

  users.prototype.getToken = function() {
    return jwt.sign(
      {user_id:this.dataValues.id},
      process.env.JWT_KEY,
      {expiresIn : '2h'}
    )
  }

  users.save = async function (user, platform_type, auth) {
    try {
      const {
        email,
        phone,
        password,
        name,
        nickname,
        gender } = user;

      let hash;
      if (platform_type != "local") {
        hash = await users.hash(password);
      } else {
        hash = password;
      }

      const new_user = await this.create({
        email,
        platform_type,
        phone,
        password: hash,
        name,
        nickname,
        gender,
        auth: auth || 0
      })
      return new_user;
    } catch (err) {
      console.log(err)
      return false;
    }
  }

  return users;
};

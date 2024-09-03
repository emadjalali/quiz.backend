const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { urlencoded, json } = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const localize = require('./localize.json');
const MongoDB = require('./utils/initMongo');
const passport = require('passport');
const { initialiseAuthentication } = require('./controller/authHelper/index');

const authRoutes = require('./routes/v1/auth.routes.js');
const hostRoutes = require('./routes/v1/host.routes.js');

module.exports = function () {
  const app = express();

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());

  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
  app.disable('x-powered-by');

  MongoDB.init()
    .then((_db) => {
      global.db = _db;
    })
    .catch((ex) => {
      throw ex;
    });

  app.get('/', (req, res) => {
    return res.status(200).json({
      success: true,
      data: localize.appRunning,
    });
  });

  const whitelist = process.env.FRONT_URL.split(',');
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: 'Content-Type',
  };
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));

  app.use(passport.initialize());
  initialiseAuthentication(app);
  authRoutes(app);
  hostRoutes(app);

  return app;
};

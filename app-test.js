const mongoose = require("mongoose");
const server = require("./app");
const chai = require("chai");
const chaiHttp = require("chai-http");

// Assertion setup
chai.should();
chai.use(chaiHttp);

// Planet model
const Planet = mongoose.model('planets');

const testPlanets = [
  { id: 1, name: "Mercury" },
  { id: 2, name: "Venus" },
  { id: 3, name: "Earth" },
  { id: 4, name: "Mars" },
  { id: 5, name: "Jupiter" },
  { id: 6, name: "Saturn" },
  { id: 7, name: "Uranus" },
  { id: 8, name: "Neptune" },
];

describe('Planets API Suite', () => {

  // Seed DB before tests
  before(async () => {
    await Planet.deleteMany({});
    await Planet.insertMany(testPlanets);
  });

  describe('Fetching Planet Details', () => {
    testPlanets.forEach(planet => {
      it(`it should fetch a planet named ${planet.name}`, (done) => {
        chai.request(server)
          .post('/planet')
          .send({ id: planet.id })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('id').eql(planet.id);
            res.body.should.have.property('name').eql(planet.name);
            done();
          });
      });
    });

    it('should return 404 for an unknown planet ID', (done) => {
      chai.request(server)
        .post('/planet')
        .send({ id: 999 })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Planet not found');
          done();
        });
    });
  });
});

describe('Testing Other Endpoints', () => {
  it('should fetch OS details', (done) => {
    chai.request(server)
      .get('/os')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('platform');
        res.body.should.have.property('arch');
        res.body.should.have.property('cpus');
        res.body.should.have.property('uptime');
        done();
      });
  });

  it('should check Liveness endpoint', (done) => {
    chai.request(server)
      .get('/live')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('live');
        done();
      });
  });

  it('should check Readiness endpoint', (done) => {
    chai.request(server)
      .get('/ready')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('ready');
        done();
      });
  });
});


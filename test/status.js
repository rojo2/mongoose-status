const {expect} = require("chai");
const mongoose = require("mongoose");
const status = require("../status");

describe("Status", function() {

  this.timeout(5000);

  before((done) => {

    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/mongoose-test", (err) => {

      if (err) {
        return done(err);
      }

      try {
        mongoose.model("status");
      } catch(error) {
        const StatusSchema = new mongoose.Schema({
          type: String
        });

        StatusSchema.plugin(status, {
          default: "not-started",
          enum: ["not-started", "started", "paused", "ended", "cancelled"],
          transitions: {
            "not-started": ["started"],
            "started": ["paused", "ended", "cancelled"],
            "paused": ["started", "cancelled"]
          }
        });

        const Status = mongoose.model("status", StatusSchema);
      }

      const Status = mongoose.model("status");
      Status.remove().then(() => done());

    });

  });

  after((done) => {
    mongoose.disconnect(done);
  });

  it("should create a status model and try to transition to a new invalid status", (done) => {
    const Status = mongoose.model("status");
    Status.create({
      type: "test"
    }).then((statusTest) => {
      expect(statusTest.transitionTo("ended")).to.be.equal(false);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it("should create a status model and try to transition to a new valid status", (done) => {
    const Status = mongoose.model("status");
    Status.create({
      type: "test"
    }).then((statusTest) => {
      expect(statusTest.transitionTo("started")).to.be.equal(true);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it("should create a status model and try to transition to a new valid status and then an invalid status", (done) => {
    const Status = mongoose.model("status");
    Status.create({
      type: "test"
    }).then((statusTest) => {
      expect(statusTest.transitionTo("started")).to.be.equal(true);
      expect(statusTest.transitionTo("not-started")).to.be.equal(false);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it("should create a status model and try to transition to a new valid status and then a valid status again", (done) => {
    const Status = mongoose.model("status");
    Status.create({
      type: "test"
    }).then((statusTest) => {
      expect(statusTest.transitionTo("started")).to.be.equal(true);
      expect(statusTest.transitionTo("ended")).to.be.equal(true);
      done();
    }).catch((err) => {
      done(err);
    });
  });

});


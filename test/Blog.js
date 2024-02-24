
// let Event = require("../models/Event");
// let chai = require("chai");
// let chaiHttp = require("chai-http");
// let app = require("../app");
// chai.should();

// chai.use(chaiHttp);

// describe("Events", () => {
//   beforeEach((done) => {
//     Event.deleteMany({}, (err) => {
//       done();
//     });
//   });
//   describe("/GET event", () => {
//     it("it should GET all the events", (done) => {
//       chai
//         .request(app)
//         .get("/api/events")
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.data.should.be.a("array");
//           res.body.data.length.should.be.eql(0);
//           done();
//         });
//     });
//   });
//   describe("/POST event", () => {
//     it("it should new POST a event", (done) => {
//       let event = {
//         "name": "Sample event",
//         "description": "Sample event",
//         "tags": [
//           "event", "testing"
//         ],
//         "importance": 1,
//         "type": "INFO",
//         "eventOn": "2023-02-27"
//       };
//       chai
//         .request(app)
//         .post("/api/events")
//         .send(event)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.status.should.be.eql("success");
//           done();
//         });
//     });
//   });
// });

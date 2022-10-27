let app = require("../src/app")
let supertest = require("supertest")
let request = supertest(app);


describe("Cadastro de usuário",() => {

    test("Deve cadastrar um usuário com sucesso",() => {

      let time = Date.now();
      let email = `${time}@gmail.com`  
      let user = {name:"Felipe",email,password:"123456"}
  
      return request.post("/user")
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toBe(email);

      }).catch(e => {
        fail(e);
      })

    })

    test("Deve impedir que um usuário se cadastre com os dados vazios", async () => {

      let user = {name:'',email:'',password:''};

      return request.post("/user")
      .send(user)
      .then(res => {
       expect(res.statusCode).toEqual(400); // BAD REQUEST

      }).catch(e => {
        fail(e);
      })
    })

    test("Deve impedir que um usuário se cadastre com um e-mail repetido", async () => {
      let time = Date.now();
      let email = `${time}@gmail.com`  
      let user = {name:"Felipe",email,password:"123456"}
  
      return request.post("/user")
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toBe(email);

        return request.post("/user")
        .send(user)
        .then(res => {
         
           expect(res.statusCode).toEqual(400);
           expect(res.body.error).toEqual("E-mail já cadastrado");
        }).catch(err => {
          fail(err);
        })
      }).catch(e => {
        fail(e);
      })
    })

})
let app = require("../src/app")
let supertest = require("supertest")
let request = supertest(app);
let jwt = require("jsonwebtoken");

let mainUser = {name: "Felipe Matheus",email:"lipehzika@hotmail.com",password:"123456"};

beforeAll(() => {
return request.post("/user")
.send(mainUser)
.then(res => {})
.catch(e => console.log(e))

})

afterAll(() => {
   return request.delete(`/deleteMock/${mainUser.email}`)
   .then(res =>{})
   .catch(e => {console.log(e)})
})



describe("Cadastro de usuário",() => {

    test("Deve cadastrar um usuário com sucesso",() => {

      let time = Date.now();
      let email = `${time}@gmail.com`  
      let user = {name:"Felipe",email,password:"1234567"}
  
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

describe("Autenticação",() => {

  test("deve me retornar um token quando logar",() => {
   return request.post("/auth")
   .send({email:mainUser.email,password:mainUser.password})
   .then(res =>{
    expect(res.statusCode).toEqual(200)
    expect(res.body.token).toBeDefined()
   })
   .catch(e => {})
  })




  test("Deve impedir que um usuário não cadastrado se logue",() => {
return request.post("/auth")
   .send({email:"UM EMAIL QUALQUER",password:"senha invalida"})
   .then(res =>{
    expect(res.statusCode).toEqual(403)
    expect(res.body.errors.email).toEqual("E-mail não cadastrado");
   })
   .catch(e => {})
  })


  test("Deve impedir que um usuário se logue com uma senha errada",() => {
    return request.post("/auth")
       .send({email:mainUser.email,password:"senha errada!"})
       .then(res =>{
        expect(res.statusCode).toEqual(403)
        expect(res.body.errors.password).toEqual("Senha incorreta");
       })
       .catch(e => {})
      })

})



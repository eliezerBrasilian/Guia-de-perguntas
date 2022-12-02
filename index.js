const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const PerguntaModel = require("./database/Pergunta");
const RespostaModel = require("./database/Resposta");
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rotas
app.get("/", (requisicao, resposta) => {
  PerguntaModel.findAll({ raw: true, order: [["id", "DESC"]] }).then(
    (perguntas) => {
      resposta.render("index", {
        perguntas: perguntas,
      });
    }
  );
});
app.get("/perguntar", (requisicao, resposta) => {
  resposta.render("perguntar");
});

app.post("/salvar_pergunta", (requisicao, resposta) => {
  var titulo = requisicao.body.titulo;
  var descricao = requisicao.body.descricao;

  //console.log(JSON.stringify(requisicao.body, null, 2));
  //var tituloJson = JSON.stringify(titulo, null, 2);
  //var descricaoJson = JSON.stringify(descricao, null, 2);
  //resposta.send(`Titulo: ${tituloJson}, Descricao: ${descricaoJson}`);

  PerguntaModel.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    resposta.redirect("/");
  });
});

app.get("/pergunta/:id", (requisicao, resposta) => {
  var id = requisicao.params.id;
  PerguntaModel.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      //achou a pergunta, ids bateram

      RespostaModel.findAll({
        where: { perguntaId: pergunta.id },
        order: [["id", "desc"]],
      }).then((respostas) => {
        resposta.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas,
        });
      });
    } else {
      resposta.redirect("/");
    }
  });
});

app.post("/responder", (requisicao, resposta) => {
  var corpo = requisicao.body.corpo; //pegando o textarea
  var perguntaId = requisicao.body.perguntaid;

  RespostaModel.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    //redirecionando o usuario pra pagina que ele respondeu a pergunta
    resposta.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(3000, (erro) => {
  if (erro) console.log("erro encontrado");
  else console.log("Servidor funcionando");
});

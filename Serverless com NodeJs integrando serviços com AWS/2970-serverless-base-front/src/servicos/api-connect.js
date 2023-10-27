import { geraUrlPreassinada } from "./generateUrlS3"

const BASE_URL = "http://curso-serverless2-api-1171980165.us-east-1.elb.amazonaws.com";

function buildFetchObj(metodo, contentType, body) {
  return ({
    method: metodo,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "PUT,POST,GET",
    },
    body: body,
  });
}

async function criaRegistro(novoRegistro) {
  const fetchObj = buildFetchObj("POST", "application/json", JSON.stringify(novoRegistro))
  try {
    const res = await fetch(`${BASE_URL}/alunos`, fetchObj);
    return res.json();
  } catch (erro) {
    return erro;
  }
}


async function geraPresignURL(nomeArquivo) {
  const urlChave = await geraUrlPreassinada(nomeArquivo);
  console.log(urlChave)
  return urlChave;
}

async function enviaArquivoViaURL(url, arquivo) {
  const fetchObj = buildFetchObj("PUT", "text/csv; charset=utf-8", arquivo)

  try {
    const res = await fetch(url, fetchObj)

    if (res.status === 200) {
      return "Upload do arquivo concluido"
    } else {
      return "Falha no upload"
    }
  } catch (erro) {
    return erro
  }
}

export { criaRegistro, geraPresignURL, enviaArquivoViaURL };

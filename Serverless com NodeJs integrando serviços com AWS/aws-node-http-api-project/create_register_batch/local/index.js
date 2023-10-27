const {
  convertDataCsv
} = require("../convertDataCsv");
const { registerStudentsInDb } = require("../registerStudentsInDb");
const {
  putUploadOnBucket,
  getDataFromCsvAtBucket
} = require("./serverS3");

module.exports.simulandoUploadCsv = async (evento) => {
  try {
    await putUploadOnBucket()
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Simulando upload de arquivo"
      })
    }
  } catch (erro) {
    return {
      statusCode: erro.statusCode || 500,
      body: JSON.stringify(erro)
    }
  }
}


module.exports.cadastrarAlunosLocal = async (event) => {
  try {
    const eventoS3 = event.Records[0].s3
    const nameBucket = eventoS3.bucket.name
    const keyBucket = decodeURIComponent(eventoS3.object.key.replace(/\+/g, ""))
    const dataArchive = await getDataFromCsvAtBucket(nameBucket, keyBucket)
    const students = await convertDataCsv(dataArchive)

    await registerStudentsInDb(students)

    console.log('deu bom')

  } catch (erro) {
    console.log(erro)
  }
};
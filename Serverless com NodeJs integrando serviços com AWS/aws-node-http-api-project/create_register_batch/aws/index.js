const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { convertDataCsv } = require("../convertDataCsv");
const { registerStudentsInDb } = require("../registerStudentsInDb");

async function getDataFromCsvAtBucket(name, key) {
    const client = new S3Client({})
    const command = new GetObjectCommand({
        Bucket: name,
        Key: key
    });
    const response = await client.send(command);
    const csvData = await response.Body.transformToString("utf-8");

    return csvData;
}

module.exports.cadastrarAlunos = async (event) => {
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
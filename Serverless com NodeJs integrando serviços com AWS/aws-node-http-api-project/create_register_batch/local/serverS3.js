const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3");
const {
    readFile
} = require("fs");
const {
    join
} = require("path");


function createClientS3Local() {
    return new S3Client({
        forcePathStyle: true,
        credentials: {
            accessKeyId: "S3RVER",
            secretAccessKey: "S3RVER"
        },
        endpoint: "http://localhost:4569"
    })
}

async function putUploadOnBucket() {
    const client = createClientS3Local()

    const archiveName = "teste.csv"
    const archiveLocation = join(__dirname, archiveName)

    try {
        const csvData = await readFileAsync(archiveLocation, "UTF-8");

        const commandUpload = new PutObjectCommand({
            Bucket: "alunos-csv-local",
            Key: archiveName,
            Body: csvData
        });

        await client.send(commandUpload);
    } catch (error) {
        console.error("Erro ao ler o arquivo:", error);
    }
}

async function readFileAsync(path, encoding) {
    return new Promise((resolve, reject) => {
        readFile(path, encoding, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}


async function getDataFromCsvAtBucket(name, key) {
    const client = createClientS3Local();

    const command = new GetObjectCommand({
        Bucket: name,
        Key: key
    });

    const response = await client.send(command);
    const csvData = await response.Body.transformToString("utf-8");

    return csvData;
}

module.exports = {
    putUploadOnBucket,
    getDataFromCsvAtBucket
}
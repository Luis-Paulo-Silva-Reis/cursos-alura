const { parse } = require("fast-csv")
async function convertDataCsv(data) {

    const resultado = new Promise((resolve, reject) => {
        const students = []

        const stream = parse({ headers: ["nome", "email"], renameHeaders: true })
            .on("data", (student) => students.push(student))
            .on("error", (erro) => reject(new Error("Houve um erro no processamento do arquivo")))
            .on("end", () => resolve(students))

        stream.write(data);
        stream.end()
    })

    if (resultado instanceof Error) throw resultado
    return resultado
}

module.exports = {
    convertDataCsv
} 
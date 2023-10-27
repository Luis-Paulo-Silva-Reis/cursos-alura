async function registerStudentsInDb(students) {
    const studentsPromise = students.map((student) => {
        return fetch("http://curso-serverless2-api-1171980165.us-east-1.elb.amazonaws.com/alunos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
    });

    const responses = await Promise.all(studentsPromise);

    if (responses.some((res) => !res.ok)) {
        throw new Error("Houve um erro ao registrar um aluno");
    }

}

module.exports = {
    registerStudentsInDb
};

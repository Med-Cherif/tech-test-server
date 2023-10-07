const axios = require("axios");
function getRandomStatus() {
  const statuses = ["pending", "accepted", "declined"];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
}

function getRandomDate() {
  const startDate = new Date("2023-10-01");
  const endDate = new Date("2023-10-31");
  const randomTimestamp =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTimestamp);
}

const generateAppointments = async () => {
  try {
    const { data } = await axios.get(
      "https://651b3b6b194f77f2a5ae5b6b.mockapi.io/api/patients"
    );
    let array = [];
    data.forEach((item) => {
      const date = getRandomDate();
      array.push({
        avatar: item.avatar,
        timeFrom: "08AM",
        timeTo: "10AM",
        date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        name: item.name,
        description:
          "I woke up with a sore throat and difficulty swallowing. It's making it hard for me to eat or drink anything",
        status: "pending",
      });
    });
    return array;
  } catch (error) {
    console.log("error");
  }
};

// generateAppointments()

module.exports = {
  generateAppointments,
};

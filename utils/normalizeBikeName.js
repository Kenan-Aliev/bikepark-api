module.exports = function (arr, route) {
  let normalizedArr = [];
  switch (route) {
    case "bike": {
      normalizedArr = arr.map((bike) => {
        if (bike.name.includes(" ")) {
          const bikeName = bike.name
            .split(" ")
            .map((word) => word[0].toUpperCase() + word.substr(1))
            .join(" ");
          return { ...bike, name: bikeName };
        } else {
          const bikeName = bike.name[0].toUpperCase() + bike.name.substr(1);
          return { ...bike, name: bikeName };
        }
      });
      break;
    }
    case "order": {
      normalizedArr = arr.map((order) => {
        return {
          ...order,
          bikes: order.bikes.map((bike) => {
            if (bike.bikeId.name.includes(" ")) {
              const bikeName = bike.bikeId.name
                .split(" ")
                .map((word) => word[0].toUpperCase() + word.substr(1))
                .join(" ");
              return { ...bike, bikeId: { ...bike.bikeId, name: bikeName } };
            } else {
              const bikeName =
                bike.bikeId.name[0].toUpperCase() + bike.bikeId.name.substr(1);
              return { ...bike, bikeId: { ...bike.bikeId, name: bikeName } };
            }
          }),
        };
      });
      break;
    }
  }

  return normalizedArr;
};

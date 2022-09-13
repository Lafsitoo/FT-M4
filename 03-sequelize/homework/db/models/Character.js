const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Character",
    {
      code: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        validate: {
          isNotHenry(value) {
            // hEnRY --> henry
            // HeNrY --> henry
            if (value.toLowerCase() === "henry") {
              throw new Error(
                "Any combination of HENRY characters is not allowed"
              );
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notIn: [["Henry", "Soy Henry", "SoyHenry"]],
        },
      },
      age: {
        type: DataTypes.INTEGER,
        get() {
          const rawValue = this.getDataValue("age");
          return rawValue ? rawValue + " years old" : null;
        },
      },
      race: {
        type: DataTypes.ENUM(
          "Human",
          "Elf",
          "Machine",
          "Demon",
          "Animal",
          "Other"
        ),
        defaultValue: "Other",
      },
      hp: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      mana: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date_added: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};

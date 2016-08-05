# Mongoose Status plugin
![Travis CI](https://travis-ci.org/rojo2/mongoose-status.svg?branch=master)

This plugin has a very simple interface:

```javascript

const User = new mongoose.Schema({

});

User.plugin(status, {
  default: "not-enabled",
  enum: ["not-enabled", "enabled", "disabled"],
  transitions: {
    "not-enabled": ["enabled"],
    "enabled": ["disabled"],
    "disabled": ["enabled"]
  }
});

// And then when you need to transition from an state A
// to a state B, you should do:
const result = user.transitionTo("disabled");
if (!result) {
  // The transition couldn't be done
}
// The transition went well

```

Made with ❤ by ROJO 2 (http://rojo2.com)

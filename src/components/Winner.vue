<template>
  <div class="pa-3">
    <v-btn @click="spin">Spin</v-btn>

    <canvas ref="canv" class="cvas" width="600" height="600"></canvas>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ this.snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Winner",

  data() {
    return {
      participants: [],
      context: null,
      wheel: {
        size: 200,
        timerhandler: {},
        speedRad: 0,
        speedDecay: 0.01,
        posRad: 0
      },
      snackbar: {
        show: false,
        timeout: 0,
        message: "",
        color: ""
      }
    };
  },

  created() {
    if (this.$store.getters.properties) {
      this.getParticipants();
    } else {
      this.$store.watch(
        () => this.$store.getters.properties,
        () => {
          this.getParticipants();
        }
      );
    }
  },

  mounted() {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.context = this.$refs["canv"].getContext("2d");

    this.drawWheel();

    // Resize the canvas to fit its parent's width.
    // Normally you'd use a more flexible resize system.
    // this.$refs["canv"].width = this.$refs["canv"].parentElement.clientWidth;
    // this.$refs["canv"].height = this.$refs["canv"].parentElement.clientHeight;
  },

  methods: {
    getParticipants() {
      this.loading = true;
      this.$http.get(this.$store.getters.apiUrl + "/participants").then(
        response => {
          this.cardVisible = true;

          this.participants = response.body;

          this.loading = false;
        },
        () => {
          this.participants = [];

          this.snackbar.show = true;
          this.snackbar.timeout = 5000;
          this.snackbar.message = "Error getting participants";
          this.snackbar.color = "error";

          this.loading = false;
        }
      );
    },

    spin() {
      if (this.wheel.speedRad <= 0) {
        this.wheel.speedRad = Math.PI / 2;
        this.wheel.timerHandler = setInterval(this.spintimer, 50);
      }
    },

    spintimer() {
      this.wheel.posRad += this.wheel.speedRad;
      while (this.wheel.posRad >= 2 * Math.PI) {
        // Keep the angle in a reasonable range
        this.wheel.posRad -= 2 * Math.PI;
      }
      this.wheel.speedRad -= this.wheel.speedDecay;
      if (this.wheel.speedRad <= 0) {
        clearInterval(this.wheel.timerHandler);
      }

      this.drawWheel();
    },

    drawWheel() {
      console.log(
        "pos: " + this.wheel.posRad + " speed: " + this.wheel.speedRad
      );

      const ctx = this.context;

      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.beginPath();
      ctx.save();

      var angleOffset = this.wheel.posRad;
      // var noPieces = this.participants.length;
      var noPieces = 5;
      for (var i = 0; i < noPieces; i++) {
        let angleStart = (i * 2 * Math.PI) / noPieces + angleOffset;
        let angleEnd = ((i + 1) * 2 * Math.PI) / noPieces + angleOffset;
        this.drawPiece(i, angleStart, angleEnd);
      }

      ctx.restore();
    },

    drawPiece(i, angleStart, angleEnd) {
      const ctx = this.context;
      ctx.save();

      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, this.wheel.size, angleStart, angleEnd);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      ctx.restore();
    }
  }
};
</script>

<style scoped>
.cvas {
  border-style: solid;
  border-width: 5px;
}
</style>
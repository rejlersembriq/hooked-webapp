<template>
  <div>
    <v-dialog v-model="showScanner" width="800px" @click:outside="close">
      <qrcode-stream v-if="showScanner" class="videoFrame" @decode="onDecode" @init="onInit" />
      <v-alert
        v-if="showAlert"
        border="right"
        colored-border
        type="error"
        elevation="2"
      >{{ this.error }}</v-alert>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "QrScanner",
  props: {
    showScanner: Boolean
  },
  
  data() {
    return {
      rawQr: "",
      error: "",
      showAlert: false
    };
  },

  methods: {
    onDecode(decodedString) {
      if (decodedString === "") {
        return;
      }

      let newParticipant = {};
      let res = decodedString.split("\n");
      for (let i = 0; i < res.length; i++) {
        let split = res[i].split(":");

        switch (split[0]) {
          case "FN":
            newParticipant.name = split[1];
            break;
          case "EMAIL":
            newParticipant.email = split[1];
            break;
          case "TEL;CELL":
          case "TEL;HOME":
          case "TEL;WORK":
            newParticipant.phone = split[1];
            break;
          case "ORG":
            newParticipant.org = split[1];
            break;
        }
      }

      if (Object.keys(newParticipant).length === 0) {
        this.rawQr = decodedString;
        this.error =
          "Unable to parse data from QR code. Is it in vCard format? Raw data: " +
          this.rawQr;
        this.showAlert = true;
        return;
      }

      this.$emit("update-participant", newParticipant);
      this.close();
    },

    close() {
      this.$emit("close-scanner");
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        this.showAlert = true;
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    }
  }
};
</script>
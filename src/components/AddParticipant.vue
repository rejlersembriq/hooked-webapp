<template>
  <div>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="accent">
          <span class="headline white--text">Add Participant</span>
          <div class="flex-grow-1"></div>
          <v-btn large icon @click.stop color="white">
            <v-icon>mdi-qrcode-scan</v-icon>
          </v-btn>
        </v-card-title>
        <v-container grid-list-sm="grid-list-sm">
          <v-layout row="row" wrap="wrap">
            <v-flex xs12>
              <v-text-field prepend-icon="person" placeholder="Name"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field prepend-icon="mail" placeholder="Email"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field type="tel" prepend-icon="phone" placeholder="Phone"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field prepend-icon="business" placeholder="Company"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field  prepend-icon="notes" placeholder="Notes"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn large bottom color="pink" dark fab fixed right @click.end="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "AddParticipant",
  data() {
    return {
      dialog: false
    };
  }
};
</script>
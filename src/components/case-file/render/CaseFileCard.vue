<template>
  <div>
    <v-row>
      <v-col
        cols="8"
        offset="2"
      >
        <v-text-field
          v-model="searchText"
          class="mx-auto"
          label="Search"
          color="success"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="d-flex justify-end">
          <v-btn
            @click="enableSelectMode"
          >
            Select
          </v-btn>
          <v-btn
            @click="$router.push({ name: 'Case File Report', params: { model: caseFileService.createNew() } })"
          >
            Create
          </v-btn>
        </div>
      </v-col>
      <v-col
        v-if="showDeleteButton"
        cols="2"
      >
        <div class="d-flex justify-end">
          <v-btn
            @click="showDeleteWarning = true"
          >
            Delete
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-data-iterator
      :items="caseFiles"
      item-key="id"
      :items-per-page="10"
      :search="searchText"
    >
      <template v-slot:default="{ items }">
        <!-- <add-new-info-bar /> -->
        <div
          v-for="(casefile, index) in items"
          :key="index"
        >
          <case-file-info-bar
            :model="casefile"
            :disabled="selectMode"
          >
            <template v-slot:caseFileSelection>
              <v-col
                v-if="selectMode"
                :cols="1"
                align-self="center"
              >
                <v-checkbox
                  v-model="selectedCaseFiles"
                  color="success"
                  :value="casefile"
                />
              </v-col>
            </template>
          </case-file-info-bar>
        </div>
      </template>
    </v-data-iterator>
    <v-dialog
      v-model="showDiscardSelectedCaseFileWarning"
      transition="dialog-bottom-transition"
      max-width="600"
      max-height="400"
    >
      <v-card>
        <v-container>
          <v-card-title>
            Discard Warning
          </v-card-title>
          <div class="d-flex align-content-center justify-center ma0-4">
            {{ showDiscardSelectedWarningMessage }}
          </div>
          <div class="d-flex align-content-center justify-center ma-4">
            <v-btn
              class="d-flex ma-2"
              @click="contiueDiscardDialog()"
            >
              <div class="primary-content-button-text">
                Continue
              </div>
            </v-btn>
            <v-btn
              class="d-flex ma-2"
              @click="showDiscardSelectedCaseFileWarning = false"
            >
              <div class="primary-content-button-text">
                Cancel
              </div>
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showDeleteWarning"
      transition="dialog-bottom-transition"
      max-width="600"
      max-height="400"
    >
      <v-card>
        <v-container>
          <v-card-title>
            Deletion
          </v-card-title>
          <div class="d-flex align-content-center justify-center ma0-4">
            {{ showDeletionWarningMessage }}
          </div>
          <div class="d-flex align-content-center justify-center ma-4">
            <v-btn
              class="d-flex ma-2"
              @click="destroySelectedCaseFiles()"
            >
              <div class="primary-content-button-text">
                Continue
              </div>
            </v-btn>
            <v-btn
              class="d-flex ma-2"
              @click="showDeleteWarning = false"
            >
              <div class="primary-content-button-text">
                Cancel
              </div>
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CaseFileInfoBar from './CaseFileInfoBar.vue'
import TYPES from '@/InjectableTypes/types'
import { inject } from 'inversify-props'
import ICaseFileInfoService from '../services/ICaseFileInfoService'
import ICaseFileInfoModel from '../types/ICaseFileInfoModel'
import ICaseFileService from '../services/ICaseFileService'

@Component({
  name: 'CaseFileCard',
  components: {
    'case-file-info-bar': CaseFileInfoBar
  }
})
export default class CaseFileCard extends Vue {
  @inject(TYPES.ICaseFileService)
  public caseFileService!: ICaseFileService

  private caseFiles: ICaseFileInfoModel[] = []
  private selectMode: boolean = false
  private selectedCaseFiles: ICaseFileInfoModel[] = []
  private showDiscardSelectedCaseFileWarning: boolean = false
  private showDeleteWarning: boolean = false
  private searchText: string = ''

  async created () {
    await this.caseFileService.clearCaseFilesFromCache()
    this.loadCaseFiles()
  }

  async beforeDestroy () {
    await this.caseFileService.clearCaseFilesFromCache()
  }

  private async loadCaseFiles () {
    await Promise.resolve(this.caseFileService.getAllCaseFiles()).then((result) => {
      this.caseFiles = result
    })
  }

  private enableSelectMode () : void {
    if (this.selectMode && this.selectedCaseFiles.length) {
      this.showDiscardSelectedCaseFileWarning = true
    } else {
      this.changeSelectMode()
    }
  }

  private changeSelectMode () : void {
    this.selectMode = !this.selectMode
  }

  get showDiscardSelectedWarningMessage () : string {
    return 'Are you sure you want to discard the current selection?'
  }

  private contiueDiscardDialog () : void {
    this.showDiscardSelectedCaseFileWarning = false
    this.selectedCaseFiles = []
    this.changeSelectMode()
  }

  private async destroySelectedCaseFiles () : Promise<void> {
    await this.caseFileService.destroyCaseFiles(this.selectedCaseFiles).then(() => {
      this.loadCaseFiles().then(() => {
        this.selectedCaseFiles = []
        this.changeSelectMode()
        this.showDeleteWarning = false
      })
    })
  }

  private async deleteSelectedCaseFiles () : Promise<void> {
    const caseFilesToDelete = this.selectedCaseFiles.map((caseFile) => {
      caseFile._deleted = true
      return caseFile
    })
    await this.caseFileService.saveAll(caseFilesToDelete).then((results) => {
      this.loadCaseFiles().then(() => {
        this.selectedCaseFiles = []
        this.changeSelectMode()
        this.showDeleteWarning = false
      })
    })
  }

  get showDeletionWarningMessage () : string {
    return 'Are you sure you want to delete the currently selected case files?'
  }

  get showDeleteButton () : boolean {
    return this.selectedCaseFiles.length > 0
  }
}
</script>

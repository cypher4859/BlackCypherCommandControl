<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      app
      left
      dark
    >
      <v-list
        nav
      >
        <v-list-item>
          <v-list-item-avatar>
            <img src="@/assets/blackmesa_logo.png">
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item
          v-for="(item, key) in menuItems"
          :key="key"
          link
        >
          <v-list-item-icon>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <hello-world /> -->
    </v-navigation-drawer>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { inject } from 'inversify-props'
import HelloWorld from '@/components/HelloWorld.vue'
import IMenuItem from '../types/IMenuItem'
import IHomeDashboardService from '../services/interfaces/IHomeDashboardService'
import IAddonsService from '../services/interfaces/IAddonsService'
import ICaseFileService from '../services/interfaces/ICaseFileService'
import INetworkMonitorService from '../services/interfaces/INetworkMonitorService'
import NetworkMonitorService from '../services/implementations/NetworkMonitorService'
import CaseFileService from '../services/implementations/CaseFileService'
import AddonsService from '../services/implementations/AddonsService'
import HomeDashboardService from '../services/implementations/HomeDashboardService'
import TYPES from '@/InjectableTypes/types'

@Component({
  name: 'NavDrawer'
  // components: {
  //   'hello-world': HelloWorld
  // }
})
export default class NavDrawer extends Vue {
  private drawer: boolean = true

  @inject(TYPES.IAddonsService)
  public addonService!: IAddonsService

  @inject(TYPES.INetworkMonitorService)
  private networkMonitorService!: INetworkMonitorService

  @inject(TYPES.ICaseFileService)
  private caseFileService!: ICaseFileService

  @inject(TYPES.IHomeDashboardService)
  private homeDashboardService!: IHomeDashboardService

  private navMenuItems: IMenuItem[] = [
    this.homeDashboardService.defaultModel(),
    this.addonService.defaultModel(),
    this.networkMonitorService.defaultModel(),
    this.caseFileService.defaultModel()
  ]

  get menuItems () {
    return this.navMenuItems
  }
}
</script>
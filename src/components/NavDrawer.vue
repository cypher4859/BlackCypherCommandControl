<template>
  <v-container>
    <v-card>
      <v-navigation-drawer
        v-model="drawer"
        permanent
        app
        left
        class="radial-gradient-background-nav"
        mini-variant
        mini-variant-width="80"
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
            @click="gotoPath(item.path)"
          >
            <v-tooltip
              right
              color="black"
              close-delay="0"
            >
              <template v-slot:activator="{ on }">
                <v-list-item-icon
                  v-on="on"
                >
                  <v-icon>
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content />
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item
            @click="logout()"
          >
            <v-tooltip
              right
              color="black"
              close-delay="0"
            >
              <template v-slot:activator="{ on }">
                <v-list-item-icon
                  v-on="on"
                >
                  <v-icon>
                    mdi-logout
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content />
              </template>
              <span>Logout</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-container>
          <v-fade-transition mode="out-in">
            <router-view :key="$route.fullPath" />
          </v-fade-transition>
        </v-container>
      </v-main>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import 'reflect-metadata'
import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
import IMenuItem from '@/types/IMenuItem'
import IHomeDashboardService from '@/components/home-dashboard/services/IHomeDashboardService'
import IAddonsService from '@/components/add-on-manager/services/IAddonsService'
import TYPES from '@/InjectableTypes/types'
import { concat } from 'lodash'
import { Component, Mixins } from 'vue-property-decorator'
import { inject } from 'inversify-props'
import ISettingsGlobalService from '@/components/settings-global/services/ISettingsGlobalService'
import RouteMixin from '@/mixins/route-mixin'

@Component({
  name: 'NavDrawer',
  components: {
    'hello-world': HelloWorld
  }
})
export default class NavDrawer extends Mixins(RouteMixin) {
  private drawer: boolean = true

  @inject(TYPES.IAddonsService)
  public addonService!: IAddonsService

  @inject(TYPES.IHomeDashboardService)
  private homeDashboardService!: IHomeDashboardService

  @inject(TYPES.ISettingsGlobalService)
  private settingsGlobalService!: ISettingsGlobalService

  mounted () {
    this.settingsGlobalService.initializeSettings()
  }

  private navMenuItems: IMenuItem[] = [
    this.homeDashboardService.defaultModel(),
    this.settingsGlobalService.defaultModel()
  ]

  get menuItems () : IMenuItem[] {
    return concat(this.navMenuItems, this.enabledAddons)
  }

  get enabledAddons () : IMenuItem[] {
    return this.addonService.getEnabledAddonsMenuItemForRender
  }

  private logout () {
    this.$emit('logout')
  }
}
</script>

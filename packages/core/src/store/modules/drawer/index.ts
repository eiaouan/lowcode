import { tr } from 'date-fns/locale'
import { defineStore } from 'pinia'

interface DrawerState {
  // 画布当中的所有组件
  components: DrawerComponent[]
  // 当前激活的组件
  activeComponent: DrawerComponent | undefined | null
}

const initDrawerState = (): DrawerState => {
  return {
    components: [],
    activeComponent: null,
  }
}

export const useDrawer = defineStore('drawer', {
  state: initDrawerState,

  actions: {
    setActiveComponent(id: string): void {
      this.activeComponent = this.getTarget(this.components, id)
    },
    //找到点击的target
    getTarget(list: any, id: string): any {
      for (let o of list) {
        if (o.id == id) return o
        if (o.children) {
          if (o.children[0] instanceof Array) {
            for (let item of o.children) {
              const o_ = this.getTarget(item, id)
              if (o_) return o_
            }
          } else {
            const o_ = this.getTarget(o.children, id)
            if (o_) return o_
          }
        }
      }
    },
    //使用filter删除要删除的id
    recuritFilter(arr: any, id: string) {
      return arr.filter((item: any) => {
        if (item.id == id) {
          return false
        }
        //flex，gird，collapse的children是二维数组
        if (item.children && item.children[0] instanceof Array) {
          for (let i = 0; i < item.children.length; i++) {
            item.children[i] = this.recuritFilter(item.children[i], id)
          }
        }
        //表单，表单项的children是一维数组
        if (item.children && !(item.children[0] instanceof Array)) {
          item.children = this.recuritFilter(item.children, id)
        }
        return true
      })
    },
    setComponent(components: DrawerComponent[]): void {
      this.components = components
    },
    removeComponent(id: string) {
      this.components = this.recuritFilter(this.components, id)
    },
    /**
     * @description 取消选中组件
     */
    resetActiveComponent() {
      this.activeComponent = null
    },
  },
})

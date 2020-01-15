import Vue from "vue";
import Router from "vue-router";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Components from "./views/Components.vue";
import Starter from "./views/Starter"

Vue.use(Router);

export default new Router({
    mode: 'history',
    linkExactActiveClass: "active",
    routes: [{
            path: "/",
            name: "starter",
            components: {
                header: null,
                default: Starter,
                footer: null
            }
        },
        {
            path: "/main",
            name: "main",
            components: {
                header: Header,
                default: Components,
                footer: Footer
            }
        }
    ],
    scrollBehavior: to => {
        if (to.hash) {
            return { selector: to.hash };
        } else {
            return { x: 0, y: 0 };
        }
    }
});
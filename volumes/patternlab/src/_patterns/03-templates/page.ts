function page_switchTheme(): void {
    /* global console */
    const app = document.getElementById("app")
    app?.classList.contains("theme_dark")
        ? swap("theme_dark", "theme_light")
        : swap("theme_light", "theme_dark")

    function swap(del: string, ins: string): void {
        app?.classList.remove(del)
        app?.classList.add(ins)
    }
}

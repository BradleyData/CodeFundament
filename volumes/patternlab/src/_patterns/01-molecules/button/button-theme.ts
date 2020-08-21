function m_button_theme__switchTheme(): void {
    /* global document */
    const themed = [...document.getElementsByClassName("themed")]
    themed.forEach((element: Element) => {
        element.classList.contains("theme_dark")
            ? swap("theme_dark", "theme_light")
            : swap("theme_light", "theme_dark")

        function swap(del: string, ins: string): void {
            element.classList.remove(del)
            element.classList.add(ins)
        }
    })
}

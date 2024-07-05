import { useCreateBlockNote } from "@blocknote/react";
import {
    BlockNoteView, Theme, darkDefaultTheme,
    lightDefaultTheme,
} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

// Base theme
const lightRedTheme = {
    colors: {
        editor: {
            text: "#222222",
            background: "#ECECED",
        },
        menu: {
            text: "#000",
            background: "#ECECED",
        },
        tooltip: {
            text: "#000",
            background: "#ECECED",
        },
        hovered: {
            text: "#000",
            background: "#ECECED",
        },
        selected: {
            text: "#000",
            background: "#ECECED",
        },
        disabled: {
            text: "#000",
            background: "#ECECED",
        },
        shadow:'#000',
        border:"none",
        sideMenu: "#bababa",
        highlights: lightDefaultTheme.colors!.highlights,
    },
    borderRadius: 4,
    fontFamily: "monasans",
} satisfies Theme;

// The theme for dark mode,
// users the light theme defined above with a few changes
const darkRedTheme = {
    ...lightRedTheme,
    colors: {
        ...lightRedTheme.colors,
        editor: {
            text: "#000",
            background: "#ECECED",
        },
        sideMenu: "#000",
        highlights: darkDefaultTheme.colors!.highlights,
    },
} satisfies Theme;

const redTheme = {
    light: lightRedTheme,
    dark: darkRedTheme,
};
const Editor = () => {
    const editor = useCreateBlockNote();
    return (
        <div className="">
            <BlockNoteView editor={editor} theme={'light'} theme={redTheme}  sideMenu={false}  />
        </div>

    )
}

export default Editor
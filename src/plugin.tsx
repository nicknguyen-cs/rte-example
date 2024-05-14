import React, { Fragment, ReactElement, useState } from "react";
import {
    Button,
    ButtonGroup,
    cbModal,
    Field,
    FieldLabel,
    Icon,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TextInput,
    Tooltip,
} from "@contentstack/venus-components";
import ContentstackSDK from "@contentstack/app-sdk";
import "./style.css";
import { IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";
import { Element } from "./interface";
import { setWidth } from "@contentstack/venus-components/build/components/Table/util";

export default ContentstackSDK.init().then(async (sdk) => {
    const extensionObj = await sdk["location"];
    const RTE = await extensionObj["RTEPlugin"];
    if (!RTE) return;


    const Dimensions = RTE("Dimensions", (rte) => ({
        title: "Dimensions",
        icon: <Icon className="p-6" icon="Edit" size="original" />,
        displayOn: "toolbar",
        elementType: "void",
    }));

    //@ts-ignore
    Dimensions.on("exec", (rte: any) => {
        cbModal({
            component: (props: any) => <CommentModal rte={rte} {...props} />,
            modalProps: {
                size: 'dynamic',
                customClass: 'comment_modal',
                shouldReturnFocusAfterClose: false
            }
        });
    });

    return {
        Dimensions,
    };
});

function CommentModal(props: any) {
    let { rte } = props;
    let [height, setHeight] = useState(0);
    let [width, setWidth] = useState(0);

    const handleClick = (e: any) => {
        let location = rte.selection.get();
        if (location) {
            rte.setAttrs({
                attrs : {
                    "percent-height": height,
                    "percent-width": width
                }
            }, location?.anchor)
        }
        props.closeModal();
    }

    return (
        <>
            <ModalHeader title="Dimensions" closeModal={props.closeModal} />
            <ModalBody>
                <FieldLabel htmlFor="height"> Height </FieldLabel>
                <TextInput
                    name="height"
                    value={0}
                    onChange={(e: any) => { setWidth(e.target.value) }}
                    type="number"
                    maxLength={3}
                    placeholder="Height"
                    id="height"
                />
                <FieldLabel htmlFor="width" > Width </FieldLabel>
                <TextInput
                    name="width"
                    value={0}
                    maxLength={3}
                    type="number"
                    onChange={(e: any) => { setHeight(e.target.value) }}
                    placeholder="Width"
                    id="width"
                />
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleClick} key="cancel">
                    Save Dimensions
                </Button>
            </ModalFooter>
        </>
    );
}
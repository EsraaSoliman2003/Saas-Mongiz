"use client";
import React from 'react'
import styles from './style.module.css';

type Props = {
    desc: string;
}

export default function DescPartWithStyles({ desc }: Props) {
    return (
        <div
            className="whitespace-pre-line text-sm leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{
                __html: desc
                    .replace(/<h1>/g, `<h1 class="${styles.descH1}">`)
                    .replace(/<p>/g, `<p class="${styles.descP}">`)
            }}
        />
    )
}
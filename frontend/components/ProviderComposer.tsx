import React, { FC, PropsWithChildren } from 'react';

interface Props {
    components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>
}

const ProviderComposer: FC<PropsWithChildren<Props>> = ({children, components}) => {
    return (
        <>
            {components.reduceRight((acc, Comp) => {
                return <Comp>{acc}</Comp>
            }, children)}
        </>
    )
}

export default ProviderComposer;
const ReceiptContent = ({props}) => {
    return(
        <>
            {
                props &&
                <div>
                    <p><strong>Reference Number: {props.referenceNumber}</strong></p>
                    <p><strong>Cash In Amount: {props.amount} PHP</strong></p>
                    <p><strong>Fee: {props.fee} PHP</strong></p>
                </div>
            }
        </>
    );
};

export default ReceiptContent;
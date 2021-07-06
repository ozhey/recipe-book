import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang='he'>
                <Head >
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="description" content="באתר ספר מתכונים ניתן לחפש מתכונים שהועלו על ידי משתמשים אחרים וגם לנהל את ספר המתכונים האישי שלכם." />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
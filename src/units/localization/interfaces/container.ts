export interface LocalizationContainer {
    page: {
        resendConfirmation: string;
        noDataToShow: string;
        forgotPassword: {
            title: string;
            message: string;
            email: string;
            send: string;
        };
        password2fa: {
            title: string;
            message: string;
        };
        modal: {
            withdraw: {
                success: {
                    title: string;
                    button: string;
                    message: {
                        content: string;
                    };
                };
            };
            expired: {
                title: string;
                submit: string;
            };
        };
        header: {
            navbar: {
                signIn: string;
                trade: string;
                wallets: string;
                openOrders: string;
                history: string;
                profile: string;
                logout: string;
            };
        };
        sidebar: {
            group: {
                text: string;
                value: string;
            };
        };
        body: {
            restricted: string;
            code500: {
                maintenance: string;
                availableSoon: string;
            };
            customization: {
                tabs: {
                    themes: string;
                    fonts: string;
                    spacing: string;
                    images: string;
                };
                comingSoon: string;
                actionButtons: {
                    reset: string;
                    save: string;
                };
                themes: {
                    selector: {
                        label: string;
                    };
                    color: {
                        mainBackgroundColor: string;
                        bodyBackgroundColor: string;
                        headerBackgroundColor: string;
                        subheaderBackgroundColor: string;
                        dropdownBackgroundColor: string;
                        icon: string;
                        primaryCtaColor: string;
                        contrastCtaColor: string;
                        secondaryContrastCtaColor: string;
                        ctaLayerColor: string;
                        systemGreen: string;
                        systemRed: string;
                        systemYellow: string;
                        asks: string;
                        bids: string;
                        primaryTextColor: string;
                        textContrastColor: string;
                        inputBackgroundColor: string;
                        dividerColor: string;
                        shadowColor: string;
                        landingBackgroundColor: string;
                        strengthMeterVeryStrong: string;
                        theme: {
                            darkBlue: {
                                title: string;
                            };
                            darkRed: {
                                title: string;
                            };
                            purple: {
                                title: string;
                            };
                            green: {
                                title: string;
                            };
                        };
                    };
                };
            };
            trade: {
                orderbook: {
                    title: string;
                    lastMarket: string;
                    header: {
                        price: string;
                        amount: string;
                        volume: string;
                    };
                };
                header: {
                    market: string;
                    yours: string;
                    asks: string;
                    bids: string;
                    openOrders: {
                        title: string;
                        content: {
                            date: string;
                            state: string;
                            price: string;
                            amount: string;
                            total: string;
                            filled: string;
                        };
                    };
                    recentTrades: {
                        title: string;
                        content: {
                            time: string;
                            price: string;
                            amount: string;
                        };
                    };
                    marketDepths: {
                        title: string;
                        content: {
                            price: string;
                            volume: string;
                            cumulativeVolume: string;
                            cumulativeValue: string;
                        };
                    };
                    markets: {
                        title: string;
                        content: {
                            market: string;
                            pair: string;
                            price: string;
                            last_price: string;
                            change: string;
                            search: string;
                            volume: string;
                        };
                    };
                    newOrder: {
                        content: {
                            tabs: {
                                buy: string;
                                sell: string;
                            };
                            orderType: {
                                title: string;
                                limit: string;
                                market: string;
                            };
                            price: string;
                            amount: string;
                            total: string;
                            available: string;
                        };
                    };
                };
            };
            tooBar: {
                lowest: string;
                lastPrice: string;
                selectMarket: string;
                highest: string;
                volume: string;
                change: string;
            };
            marketsTable: {
                filter: {
                    all: string;
                };
                header: {
                    pair: string;
                    lastPrice: string;
                    change: string;
                    high: string;
                    low: string;
                    volume: string;
                };
            };
            landing: {
                header: {
                    button1: string;
                    button2: string;
                    button3: string;
                };
                marketInfo: {
                    title: {
                        text1: string;
                        text2: string;
                        button: string;
                    };
                };
                platformInfo: {
                    item: {
                        first: {
                            value: string;
                            title: string;
                        };
                        second: {
                            value: string;
                            title: string;
                        };
                        third: {
                            value: string;
                            title: string;
                        };
                    };
                };
                register: {
                    item: {
                        title: string;
                        text: string;
                        button: string;
                    };
                };
                features: {
                    features: {
                        item1: {
                            title: string;
                            text: string;
                        };
                        item2: {
                            title: string;
                            text: string;
                        };
                        item3: {
                            title: string;
                            text: string;
                        };
                        item4: {
                            title: string;
                            text: string;
                        };
                        item5: {
                            title: string;
                            text: string;
                        };
                        item6: {
                            title: string;
                            text: string;
                        };
                    };
                };
                tradeOnTheGo: {
                    item: {
                        title: string;
                        text1: string;
                        text2: string;
                        text3: string;
                        button: string;
                    };
                };
                startTrading: {
                    title: string;
                    button1: string;
                    button2: string;
                };
                footer: {
                    exchange: string;
                    wallets: string;
                    fees: string;
                    faq: string;
                    support: string;
                    privacy: string;
                    about: string;
                    community: string;
                    info: string;
                    rights: string;
                };
            };
            footer: {
                powered_by: string;
            };
            wallets: {
                estimated_value: string;
                locked: string;
                balance: string;
                tabs: {
                    deposit: {
                        disabled: {
                            message: string;
                        };
                        ccy: {
                            message: {
                                submit: string;
                                address: string;
                                button: string;
                                success: string;
                                error: string;
                            };
                            button: {
                                generate: string;
                                address: string;
                            };
                        };
                        fiat: {
                            message1: string;
                            message2: string;
                            bankName: string;
                            accountNumber: string;
                            accountName: string;
                            phoneNumber: string;
                            referenceCode: string;
                            admin: string;
                        };
                    };
                    withdraw: {
                        title: string;
                        content: {
                            amount: string;
                            code2fa: string;
                            fee: string;
                            total: string;
                            button: string;
                            enable2fa: string;
                            enable2faButton: string;
                        };
                        disabled: {
                            message: string;
                        };
                        modal: {
                            confirmation: string;
                            message1: string;
                            message2: string;
                            button: {
                                cancel: string;
                                withdraw: string;
                            };
                        };
                    };
                };
                table: {
                    pending: string;
                    rejected: string;
                };
                beneficiaries: {
                    title: string;
                    addAddress: string;
                    tipAddress: string;
                    tipName: string;
                    tipDescription: string;
                    failAddModal: {
                        header: string;
                        content: string;
                        button: string;
                    };
                    fiat: {
                        title: string;
                        account: string;
                        bankOfBeneficiary: string;
                        beneficiary: string;
                        description: string;
                        name: string;
                        fullName: string;
                    };
                    dropdown: {
                        address: string;
                        select: string;
                        name: string;
                        pending: string;
                    };
                    addAddressModal: {
                        header: string;
                        body: {
                            coinAddress: string;
                            coinBeneficiaryName: string;
                            coinDescription: string;
                            fiatName: string;
                            fiatFullName: string;
                            fiatAccountNumber: string;
                            fiatBankName: string;
                            fiatBankSwiftCode: string;
                            fiatIntermediaryBankName: string;
                            fiatIntermediaryBankSwiftCode: string;
                            button: string;
                        };
                    };
                    confirmationModal: {
                        header: string;
                        body: {
                            text: string;
                            confirmationModalCode: string;
                            button: string;
                        };
                    };
                };
            };
            openOrders: {
                tab: {
                    all: string;
                    open: string;
                };
                header: {
                    pair: string;
                    amount: string;
                    price: string;
                    executed: string;
                    remaining: string;
                    costRemaining: string;
                    status: string;

                    content: {
                        status: {
                            done: string;
                            wait: string;
                            cancel: string;
                        };
                    };
                    orderType: {
                        title: string;
                        buy: {
                            market: string;
                            limit: string;
                        };
                        sell: {
                            market: string;
                            limit: string;
                        };
                    };
                    button: {
                        cancelAll: string;
                    };
                };
            };
            history: {
                deposit: {
                    title: string;
                    header: {
                        txid: string;
                        date: string;
                        currency: string;
                        amount: string;
                        status: string;
                        content: {
                            status: {
                                accepted: string;
                                collected: string;
                                submitted: string;
                                canceled: string;
                                rejected: string;
                                skipped: string;
                            };
                        };
                    };
                };
                withdraw: {
                    title: string;
                    header: {
                        id: string;
                        date: string;
                        currency: string;
                        address: string;
                        amount: string;
                        status: string;
                    };
                    content: {
                        status: {
                            prepared: string;
                            submitted: string;
                            skipped: string;
                            canceled: string;
                            accepted: string;
                            suspected: string;
                            rejected: string;
                            processing: string;
                            succeed: string;
                            failed: string;
                            confirming: string;
                            errored: string;
                        };
                    };
                };
                title: {
                    title: string;
                    header: {
                        id: string;
                        date: string;
                        side: string;
                        market: string;
                        price: string;
                        total: string;
                        amount: string;
                        balance: string;
                    };
                    content: {
                        side: {
                            buy: string;
                            sell: string;
                        };
                    };
                };
            };
            proifle: {
                header: {
                    referralProgram: string;
                    accountActivity: {
                        title: string;
                        content: {
                            date: string;
                            addressip: string;
                            action: string;
                            result: string;
                            userAgent: string;
                        };
                    };
                    account: {
                        title: string;
                        content: {
                            password: {
                                title: string;
                                old: string;
                                new: string;
                                conf: string;
                                button: {
                                    change: string;
                                    save: string;
                                    cancel: string;
                                };
                                dont: {
                                    match: string;
                                };
                                change: {
                                    success: string;
                                    title: string;
                                };
                            };
                        };
                        twoFactorAuthentication: {
                            title: string;
                            header: string;
                            subHeader: string;
                            enable: string;
                            disable: string;
                            modalBody: string;
                            modalHeader: string;
                            message: {
                                enable: string;
                                disable: string;
                                n1: string;
                                or: string;
                                n2: string;
                                n3: string;
                                mfa: string;
                                n4: string;
                            };
                        };
                        profile: {
                            title: string;
                            email: {
                                title: string;
                                message: string;
                            };
                            phone: {
                                title: string;
                                message: string;
                                unverified: {
                                    title: string;
                                };
                            };
                            identity: {
                                title: string;
                                message: string;
                                unverified: {
                                    title: string;
                                };
                            };
                        };
                    };
                };
                content: {
                    copyLink: string;
                    action: {
                        login: string;
                        logout: string;
                        request2fa: string;
                        enable2fa: string;
                        login2fa: string;
                        requestPasswordReset: string;
                        passwordReset: string;
                    };
                    result: {
                        succeed: string;
                        failed: string;
                        denied: string;
                    };
                };
                apiKeys: {
                    noOtp: string;
                    show: string;
                    noKeys: string;
                    header: {
                        title: string;
                        create: string;
                    };
                    modal: {
                        created_header: string;
                        access_key: string;
                        secret_key_info: string;
                        secret_key_store: string;
                        note: string;
                        note_content: string;
                        title: string;
                        label: string;
                        placeholder: string;
                        btn: {
                            show: string;
                            create: string;
                            copy: string;
                            activate: string;
                            disabled: string;
                            delete: string;
                        };
                        header: {
                            title: string;
                        };
                    };
                    table: {
                        header: {
                            kid: string;
                            algorithm: string;
                            state: string;
                            created: string;
                            updated: string;
                        };
                    };
                };
                verification: {
                    pending: string;
                    reverify: string;
                    verify: string;
                    verified: string;
                    progress: {
                        level: string;
                    };
                    email: {
                        title: string;
                        subtitle: string;
                        rejected: {
                            tooltip: string;
                        };
                    };
                    phone: {
                        title: string;
                        subtitle: string;
                        rejected: {
                            tooltip: string;
                        };
                    };
                    profile: {
                        title: string;
                        subtitle: string;
                        rejected: {
                            tooltip: string;
                        };
                    };
                    document: {
                        title: string;
                        subtitle: string;
                        rejected: {
                            tooltip: string;
                        };
                    };
                    address: {
                        title: string;
                        subtitle: string;
                        rejected: {
                            tooltip: string;
                        };
                    };
                };
            };
            kyc: {
                next: string;
                submit: string;
                head: {
                    phone: string;
                    identity: string;
                    document: string;
                };
                phone: {
                    phoneNumber: string;
                    code: string;
                    send: string;
                    resend: string;
                    head: string;
                    enterPhone: string;
                    enterCode: string;
                };
                documents: {
                    drag: string;
                    maxFile: string;
                    maxNum: string;
                    upload: string;
                    number: string;
                    select: {
                        passport: string;
                        identityCard: string;
                        driverLicense: string;
                        utilityBill: string;
                    };
                    country: {
                        title: string;
                        placeholder: string;
                    };
                    idNumber: {
                        title: string;
                        placeholder: string;
                    };
                    issuedDate: {
                        title: string;
                        placeholder: string;
                    };
                    expiryDate: {
                        title: string;
                        placeholder: string;
                    };
                    uploadFile: {
                        front: {
                            title: string;
                            label: string;
                            button: string;
                            sizes: string;
                            formats: string;
                        };
                        back: {
                            title: string;
                            label: string;
                            button: string;
                            sizes: string;
                            formats: string;
                        };
                        selfie: {
                            title: string;
                            label: string;
                            button: string;
                            sizes: string;
                            formats: string;
                        };
                    };
                };
                documentsType: {
                    title: string;
                    placeholder: string;
                };
                address: {
                    address: {
                        title: string;
                        placeholder: string;
                    };
                    city: {
                        title: string;
                        placeholder: string;
                    };
                    postcode: {
                        title: string;
                        placeholder: string;
                    };
                    country: {
                        title: string;
                        placeholder: string;
                    };
                    uploadFile: {
                        title: string;
                        label: string;
                        button: string;
                        sizes: string;
                        formats: string;
                        tip: string;
                    };
                };
                identity: {
                    firstName: string;
                    lastName: string;
                    CoR: string;
                    residentialAddress: string;
                    city: string;
                    postcode: string;
                    dateOfBirth: {
                        title: string;
                        placeholder: string;
                    };
                };
                nationalities: {
                    [key: string]: string;
                };
            };
            lock: {
                oops: string;
                expired: string;
                license: string;
                visit: string;
            };
        };
        order: {
            create: {
                minAmount: string;
                minPrice: string;
                maxPrice: string;
                available: string;
            };
        };
    };
    success: {
        beneficiaries: {
            created: string;
            activated: string;
            deleted: string;
        };
        api_keys: {
            fetched: string;
            created: string;
            copied: {
                access: string;
                secret: string;
            };
            updated: string;
            deleted: string;
        };
        addresses: {
            accepted: string;
        };
        documents: {
            accepted: string;
        };
        identity: {
            accepted: string;
        };
        withdraw: {
            action: string;
        };
        otp: {
            enabled: string;
            disabled: string;
        };
        password: {
            forgot: string;
            changed: {
                title: string;
                successfuly: string;
            };
        };
        order: {
            cancelling: string;
            canceled: string;
            canceledAll: string;
            cancellingAll: string;
            created: string;
            done: string;
        };
        phone: {
            verification: {
                send: string;
            };
            confirmed: string;
            confirmation: {
                message: string;
            };
        };
        message: {
            sent: string;
        };
        email: {
            confirmed: string;
        };
        data: {
            changed: {
                language: string;
            };
        };
    };
    confirm: {
        title: {
            email: string;
            phone: string;
            profile: string;
            document: string;
            address: string;
        };
    };
    header: {
        signIn: {
            title: string;
            email: string;
            receiveConfirmation: string;
            forgotPassword: string;
            password: {
                title: string;
                message: {
                    error: string;
                };
            };
            resetPassword: {
                title: string;
                newPassword: string;
                repeatPassword: string;
                button: string;
                error: string;
            };
        };
        signUp: {
            title: string;
            email: {
                title: string;
                message: {
                    error: string;
                };
            };
            password: {
                title: string;
                weak: string;
                good: string;
                strong: string;
                message: {
                    error: string;
                };
                too: {
                    weak: string;
                };
                very: {
                    strong: string;
                };
            };
            confirmPassword: {
                title: string;
                message: {
                    error: string;
                };
            };
            referalCode: string;
            terms: string;
            modal: {
                header: string;
                body: string;
                footer: string;
            };
            strength: {
                password: string;
            };
        };
    };
    footer: {
        legalDocuments: string;
        faq: string;
    };
    sentry: {
        report_feedback: string;
    };
    error: {
        order: {
            rejected: string;
        };
        invalid_request: string;
        bad_request: string;
        request_entity_too_large: string;
    };
    resource: {
        labels: {
            private: string;
            missing_key: string;
            empty_key: string;
            missing_value: string;
            empty_value: string;
        };
        user: {
            no_activity: string;
            missing_topic: string;
            empty_topic: string;
            missing_old_password: string;
            empty_old_password: string;
            missing_new_password: string;
            empty_new_password: string;
            missing_confirm_password: string;
            empty_confirm_password: string;
        };
        no_activity: {
            not_exist: string;
            exist: string;
        };
        api_key: {
            n2fa_disabled: string;
            missing_otp: string;
            invalid_otp: string;
            missing_algorithm: string;
            empty_algorithm: string;
            empty_kid: string;
            empty_scope: string;
            missing_totp: string;
            empty_totp: string;
            missing_kid: string;
            empty_state: string;
        };
        phone: {
            twillio: string;
            invalid_num: string;
            exists: string;
            number_exist: string;
            verification_invalid: string;
            missing_phone_number: string;
            empty_phone_number: string;
            missing_verification_code: string;
            empty_verification_code: string;
        };
        documents: {
            limit_reached: string;
            limit_will_be_reached: string;

            missing_doc_expire: string;
            empty_doc_expire: string;
            missing_doc_type: string;
            empty_doc_type: string;
            missing_doc_number: string;
            empty_doc_number: string;
            missing_upload: string;
        };
        otp: {
            already_enabled: string;
            invalid: string;
            missing_code: string;
            empty_code: string;
        };
        password: {
            doesnt_match: string;
            prev_pass_not_correct: string;
            no_change_provided: string;
            password_strength: string;
        };
        document: {
            empty_doc_expire: string;
        };
        requirements: string;
        profile: {
            missing_first_name: string;
            missing_last_name: string;
            missing_dob: string;
            missing_address: string;
            missing_postcode: string;
            missing_city: string;
            missing_country: string;
        };
    };
    email: {
        taken: string;
    };
    identity: {
        password: {
            user_doesnt_exist: string;
        };
        session: {
            invalid_login_params: string;
            invalid: string;
            not_active: string;
            banned: string;
            invalid_params: string;
            missing_otp: string;
            invalid_otp: string;
            missing_emai: string;
            missing_password: string;
            invalid_captcha_format: string;
        };
        captcha: {
            required: string;
            mandatory_fields: string;
        };
        user: {
            invalid_referral_format: string;
            referral_doesnt_exist: string;
            active_or_doesnt_exist: string;
            passwords_doesnt_match: string;
            utilized_token: string;
            missing_email: string;
            empty_email: string;
            missing_password: string;
            empty_password: string;
            missing_token: string;
            empty_token: string;
            missing_reset_password_token: string;
            empty_reset_password_token: string;
            missing_confirm_password: string;
            empty_confirm_password: string;
        };
    };
    first_name: {
        invalid: string;
        blank: string;
    };
    last_name: {
        invalid: string;
        blank: string;
    };
    city: {
        invalid: string;
        city: string;
    };
    postcode: {
        invalid: string;
        blank: string;
    };
    address: {
        invalid: string;
        blank: string;
    };
    dob: {
        blank: string;
    };
    country: {
        blank: string;
        must_alpha2_or_alpha3: string;
    };
    totp: {
        error: string;
    };
    record: {
        not_found: string;
    };
    jwt: {
        decode_and_verify: string;
    };
    authz: {
        invalid_session: string;
        user_not_active: string;
        invalid_signature: string;
        apikey_not_active: string;
        disabled_2fa: string;
        invalid_api_key_headers: string;
        permission_denied: string;
        unexistent_apikey: string;
        client_session_mismatch: string;
        csrf_token_mismatch: string;
    };
    account: {
        currency: {
            doesnt_exist: string;
        };
        deposit: {
            invalid_state: string;
            non_integer_limit: string;
            invalid_limit: string;
            non_positive_page: string;
            empty_txid: string;
        };
        deposit_address: {
            invalid_address_format: string;
            doesnt_support_cash_address_format: string;
        };
        withdraw: {
            non_integer_limit: string;
            invalid_limit: string;
            non_positive_page: string;
            non_integer_otp: string;
            empty_otp: string;
            empty_rid: string;
            non_decimal_amount: string;
            non_positive_amount: string;
            not_permitted: string;
            insufficient_balance: string;
            invalid_amount: string;
            create_error: string;
            invalid_otp: string;
            disabled_api: string;
        };
    };
    market: {
        market: {
            doesnt_exist: string;
        };
        order: {
            invalid_state: string;
            invalid_limit: string;
            non_integer_limit: string;
            invalid_order_by: string;
            invalid_side: string;
            non_decimal_volume: string;
            non_positive_volume: string;
            invalid_type: string;
            non_decimal_price: string;
            non_positive_price: string;
            non_integer_id: string;
            empty_id: string;
            insufficient_market_liquidity: string;
            invalid_volume_or_price: string;
            create_error: string;
            cancel_error: string;
            market_order_price: string;
        };
        trade: {
            empty_page: string;
            non_integer_limit: string;
            invalid_limit: string;
            non_integer_timestamp: string;
            empty_timestamp: string;
            invalid_order_by: string;
            not_permitted: string;
        };
        account: {
            insufficient_balance: string;
        };
    };
    public: {
        currency: {
            doesnt_exist: string;
            invalid_type: string;
        };
        market: {
            doesnt_exist: string;
        };
        order_book: {
            non_integer_ask_limit: string;
            invalid_ask_limit: string;
            non_integer_bid_limit: string;
            invalid_bid_limit: string;
        };
        trade: {
            non_integer_limit: string;
            invalid_limit: string;
            non_positive_page: string;
            non_integer_timestamp: string;
            invalid_order_by: string;
        };
        market_depth: {
            non_integer_limit: string;
            invalid_limit: string;
        };
        k_line: {
            non_integer_period: string;
            invalid_period: string;
            non_integer_time_from: string;
            empty_time_from: string;
            non_integer_time_to: string;
            empty_time_to: string;
            non_integer_limit: string;
            invalid_limit: string;
        };
    };
    server: {
        internal_error: string;
    };
    password: {
        strength: {
            tip: {
                influence: string;
                number: {
                    characters: string;
                };
                letter: string;
                digit: string;
            };
        };
    };
}

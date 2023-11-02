import { signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { auth } from "./firebaseModule.js";

    
    const urlParams = new URLSearchParams(window.location.search);
    const signInEmail = urlParams.get("email");
    const singInUserType = urlParams.get("userType");

    let email = signInEmail;
    let userType =singInUserType;
    

    const signOutB = document.getElementById('signOut');
    const adminModuleWrapper = document.getElementById('adminModule'); 

    
    onLoad();

    function onLoad() {
        document.getElementById("Email").textContent = signInEmail;
        document.getElementById("userType").textContent = singInUserType;

        
        if (userType === 'staff') {
            adminModuleWrapper.style.display = 'none'; 
            showMemberDetails();
        }else if(userType == 'admin'){
            adminModuleWrapper.style.display = 'block'; 
            showMemberDetails();
        }

        if (!email|| !userType) {
            // Disable or hide modules when signInEmail or signInUserType is not available
            disableModules();
        } 
    }

    function disableModules() {
        // Disable or hide all modules here
        const modules = [
            'member', 'collectionList', 'property', 'reserve', 'certificateSelect', 'account', 'reportSelect', 'colCat'
        ];
    
        modules.forEach(moduleId => {
            const moduleElement = document.getElementById(moduleId);
            moduleElement.style.display = 'none'; // or disable the module in another way
        });
    }


    const logout = async () => {
        const url = `http://127.0.0.1:5500/index.html`;
        await signOut(auth);
        window.location.href = url;
        window.location.replace(url);
    }

    signOutB.addEventListener("click", logout);

   
        
    
























































































  //start modules  
    document.getElementById('member').addEventListener('click', showMemberDetails);    
    document.getElementById('collectionList').addEventListener('click', showCollectionlist);
    document.getElementById('property').addEventListener('click', showProperty);
    document.getElementById('reserve').addEventListener('click', Reservation);
    document.getElementById('certificateSelect').addEventListener('change', handleCertificateSelection);
    document.getElementById('account').addEventListener('click', Account);
    document.getElementById('reportSelect').addEventListener('change',handleReports );
    document.getElementById('colCat').addEventListener('click', collectionCat);
//end modules



    function handleReports(event) {
        var selectElement = event.target;
        var selectedValue = selectElement.value;
        if (selectedValue === "collectionList") {
            collectionListReport();
        } else if (selectedValue === "property") {
            propertyReport();
        } else if (selectedValue === "reservation") {
            reservationReport();
        }
    }
    function collectionCat() {
        if (activeIframe) {
            activeIframe.style.display = 'none';
        }
        var colCat = document.querySelector('.colCat-iframe-wrapper');
        colCat.style.display = 'block';
        colCat.style.width = '100%';
        var propertyIframe = document.getElementById('colCat-iframe');
        propertyIframe.src = 'collectionCategory.html';
        activeIframe = colCat;
        }

    function reservationReport() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var reservationReport = document.querySelector('.reservationReport-iframe-wrapper');
            reservationReport.style.display = 'block';
            reservationReport.style.width = '100%';
            var propertyIframe = document.getElementById('reservationReport-iframe');
            propertyIframe.src = 'reportReservation.html';
            activeIframe = reservationReport;
            }

    function propertyReport() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var collectionReport = document.querySelector('.collectionReport-iframe-wrapper');
            collectionReport.style.display = 'block';
            collectionReport.style.width = '100%';
            var propertyIframe = document.getElementById('collectionReport-iframe');
            propertyIframe.src = 'reportProperty.html';
            activeIframe = collectionReport;
            }

    function collectionListReport() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var collectionReport = document.querySelector('.collectionReport-iframe-wrapper');
            collectionReport.style.display = 'block';
            collectionReport.style.width = '100%';
            var propertyIframe = document.getElementById('collectionReport-iframe');
            propertyIframe.src = 'reportCollectionList.html';
            activeIframe = collectionReport;
            }


            function handleCertificateSelection(event) {
                var selectElement = event.target;
                var selectedValue = selectElement.value;
                if (selectedValue === "building") {
                    building();
                } else if (selectedValue === "membership") {
                    membership();
                } else if (selectedValue === "owner") {
                    owner();
                }
            }
    
        var activeIframe = null;
        
            function showMemberDetails() {
                if (activeIframe) {
                    activeIframe.style.display = 'none';
                }
                var memberlistIframeWrapper = document.querySelector('.memberdetails-iframe-wrapper');
                memberlistIframeWrapper.style.display = 'block';
                var memberlistIframe = document.getElementById('memberdetails-iframe');
                memberlistIframe.src = 'members.html';
                activeIframe = memberlistIframeWrapper;
            }
    
                function showCollectionlist() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var collectionIframeWrapper = document.querySelector('.collectionlist-iframe-wrapper');
            collectionIframeWrapper.style.display = 'block';
            var collectionIframe = document.getElementById('collectionlist-iframe');
            collectionIframe.src = 'collectionList.html';
            activeIframe = collectionIframeWrapper;
            }
    
        
            function showProperty() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var propertyIframeWrapper = document.querySelector('.property-iframe-wrapper');
            propertyIframeWrapper.style.display = 'block';
            var propertyIframe = document.getElementById('property-iframe');
            propertyIframe.src = 'property.html';
            activeIframe = propertyIframeWrapper;
            }
    
            function Reservation() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var reservationIframeWrapper = document.querySelector('.reservation-iframe-wrapper');
            reservationIframeWrapper.style.display = 'block';
            reservationIframeWrapper.style.width = '100%';
            var propertyIframe = document.getElementById('reservation-iframe');
            propertyIframe.src = 'Reservation.html';
            activeIframe = reservationIframeWrapper;
            }
    
            function building() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var buildingIframeWrapper = document.querySelector('.building-iframe-wrapper');
            buildingIframeWrapper.style.display = 'block';
            buildingIframeWrapper.style.width = '100%';
            var propertyIframe = document.getElementById('building-iframe');
            propertyIframe.src = 'buildingclearance.html';
            activeIframe = buildingIframeWrapper;
            }
    
            function membership() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var membershipIframeWrapper = document.querySelector('.membership-iframe-wrapper');
            membershipIframeWrapper.style.display = 'block';
            membershipIframeWrapper.style.width = '100%';
            var propertyIframe = document.getElementById('membership-iframe');
            propertyIframe.src = 'certificateofmembership.html';
            activeIframe = membershipIframeWrapper;
            }
    
            function owner() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var ownerIframeWrapper = document.querySelector('.owner-iframe-wrapper');
            ownerIframeWrapper.style.display = 'block';
            ownerIframeWrapper.style.width = '100%';
            var propertyIframe = document.getElementById('owner-iframe');
            propertyIframe.src = 'titlecertificate.html';
            activeIframe = ownerIframeWrapper;
            }
    
    
    
        function Account() {
            if (activeIframe) {
                activeIframe.style.display = 'none';
            }
            var accountIframeWrapper = document.querySelector('.accounts-iframe-wrapper');
            accountIframeWrapper.style.display = 'block';
            accountIframeWrapper.style.width = '100%';
            var propertyIframe = document.getElementById('accounts-iframe');
            propertyIframe.src = 'accounts.html';
            activeIframe = accountIframeWrapper;
            }
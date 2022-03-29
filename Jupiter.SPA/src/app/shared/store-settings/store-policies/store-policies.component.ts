import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

declare var $: any;

@Component({
  selector: 'app-store-policies',
  templateUrl: './store-policies.component.html',
  styleUrls: ['./store-policies.component.scss']
})
export class StorePoliciesComponent implements OnInit {

  storePoliciesGroup: FormGroup;
  teamStoreId: number;
  selectedPolicy: string;
  isEditable: boolean;
  storePoliciesObj: any[] = [];
  thankYouMessageSelected: string;
  PackingSlipFooterSelected: string;
  privacyPolicySelected: string;
  termsOfUseSelected: string;
  thankYouMessage: any;
  PackingSlipFooter: any;
  privacyPolicy: any;
  termsOfUse: any;
  addPolicyFormGroup: FormGroup;
  defaultThankYouMessage = "<p><strong>Thank you!</strong> Your order has been placed.</p><p><br></p><p><br></p><p>An email confirmation has been sent to you. If you have any questions or if you need to make a change, contact us.</p><p><br></p>";
  defaultPackingSlipFooter = "<p>We appreciate your business! Thank you for shopping with us.</p><p><br></p>";
  defaultPrivacyPolicy = "<p>This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p><p><br></p><p>What personal information do we collect from the people that visit our blog, website or app?</p><p><br></p><p>When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, credit card information or other details to help you with your experience.</p><p><br></p><p>When do we collect information?</p><p><br></p><p>We collect information from you when you register on our site, place an order, Open a Support Ticket or enter information on our site.</p><p><br></p><p>How do we use your information?</p><p><br></p><p>We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• To improve our website in order to better serve you.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• To allow us to better service you in responding to your customer service requests.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• To quickly process your transactions.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• To send periodic emails regarding your order or other products and services.</p><p><br></p><p>How do we protect your information?</p><p><br></p><p>Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.</p><p><br></p><p>We use regular Malware Scanning.</p><p><br></p><p>Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</p><p><br></p><p>We implement a variety of security measures when a user places an order enters, submits, or accesses their information to maintain the safety of your personal information.</p><p><br></p><p>All transactions are processed through a gateway provider and are not stored or processed on our servers.</p><p><br></p><p>Do we use 'cookies'?</p><p><br></p><p>Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p><p><br></p><p>We use cookies to:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Help remember and process the items in the shopping cart.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Understand and save user's preferences for future visits.</p><p><br></p><p>You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.</p><p><br></p><p>If users disable cookies in their browser:</p><p><br></p><p>If you turn cookies off, some features will be disabled. Some of the features that make your site experience more efficient and may not function properly.</p><p><br></p><p>However, you will still be able to place orders over the telephone by contacting customer service.</p><p><br></p><p>Third-party disclosure</p><p><br></p><p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.</p><p><br></p><p>Third-party links</p><p><br></p><p>We do not include or offer third-party products or services on our website.</p><p><br></p><p>Google</p><p><br></p><p>Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. https://support.google.com/adwordspolicy/answer/1316548?hl=en</p><p><br></p><p>We use Google AdSense Advertising on our website.</p><p><br></p><p>Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.</p><p><br></p><p>We have implemented the following:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Remarketing with Google AdSense</p><p><br></p><p>We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website.</p><p><br></p><p>Opting out:</p><p><br></p><p>Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising Initiative Opt Out page or by using the Google Analytics Opt Out Browser add on.</p><p><br></p><p>California Online Privacy Protection Act</p><p><br></p><p>CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. - See more at: http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</p><p><br></p><p>According to CalOPPA, we agree to the following:</p><p><br></p><p>Users can visit our site anonymously.</p><p><br></p><p>Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.</p><p><br></p><p>Our Privacy Policy link includes the word 'Privacy' and can easily be found on the page specified above.</p><p><br></p><p>You will be notified of any Privacy Policy changes:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• On our Privacy Policy Page</p><p><br></p><p>Can change your personal information:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• By logging in to your account</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• By chatting with us or by sending us a support ticket</p><p><br></p><p>How does our site handle Do Not Track signals?</p><p><br></p><p>We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.</p><p><br></p><p>Does our site allow third-party behavioral tracking?</p><p><br></p><p>It's also important to note that we allow third-party behavioral tracking</p><p><br></p><p>COPPA (Children Online Privacy Protection Act)</p><p><br></p><p>When it comes to the collection of personal information from children under the age of 13 years old, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States' consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.</p><p><br></p><p>We do not specifically market to children under the age of 13 years old.</p><p><br></p><p>Fair Information Practices</p><p><br></p><p>The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p><p><br></p><p>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</p><p><br></p><p>We will notify you via email</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Within 7 business days</p><p><br></p><p>We will notify the users via in-site notification</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Within 7 business days</p><p><br></p><p>We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.</p><p><br></p><p>CAN SPAM Act</p><p><br></p><p>The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.</p><p><br></p><p>We collect your email address in order to:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Send information, respond to inquiries, and/or other requests or questions</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Process orders and to send information and updates pertaining to orders.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Send you additional information related to your product and/or service</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Market to our mailing list or continue to send emails to our clients after the original transaction has occurred.</p><p><br></p><p>To be in accordance with CANSPAM, we agree to the following:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Not use false or misleading subjects or email addresses.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Identify the message as an advertisement in some reasonable way.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Include the physical address of our business or site headquarters.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Monitor third-party email marketing services for compliance, if one is used.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Honor opt-out/unsubscribe requests quickly.</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Allow users to unsubscribe by using the link at the bottom of each email.</p><p><br></p><p>If at any time you would like to unsubscribe from receiving future emails, you can email us by:</p><p><br></p><p>&nbsp;&nbsp;&nbsp;• Follow the instructions at the bottom of each email and we will promptly remove you from ALL correspondence.</p><p><br></p><p>Contacting Us:</p><p><br></p><p>If there are any questions regarding this privacy policy, you may contact us using the contact information on the website.</p><p><br></p>  ";
  defaultTermsOfUse = "<p>We strive for 100% Customer Satisfaction. If you are not completely satisfied with your products or Service, please contact us immediately.</p><p><br></p><p><br></p>";


  constructor(private formBuilder: FormBuilder, private storeService: StoreService, private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpStorePoliciesFormGroup();
    this.getStorePolicies();
    this.createAddPolicyFormGroup();
  }

  createAddPolicyFormGroup() {
    this.addPolicyFormGroup = this.formBuilder.group({
      text: new FormControl('')
    });
  }

  setUpStorePoliciesFormGroup() {
    this.storePoliciesGroup = this.formBuilder.group({
      thankYouMessage: new FormControl('', Validators.required),
      PackingSlipFooter: new FormControl('', Validators.required),
      privacyPolicy: new FormControl('', Validators.required),
      termsOfUse: new FormControl('', Validators.required),
    });
  }

  saveTeamStoreChanges() {
    if (this.storePoliciesGroup.valid) {
      let policyListObj: any[] = [];
      policyListObj.push({
        "storePolicyType": "0", "storePolicyTextType": this.storePoliciesGroup.value.thankYouMessage, "policyText": this.thankYouMessageSelected != "" ? this.thankYouMessageSelected : this.defaultThankYouMessage
      }, {
        "storePolicyType": "1", "storePolicyTextType": this.storePoliciesGroup.value.PackingSlipFooter, "policyText": this.PackingSlipFooterSelected != "" ? this.PackingSlipFooterSelected : this.defaultPackingSlipFooter
      }, {
        "storePolicyType": "2", "storePolicyTextType": this.storePoliciesGroup.value.privacyPolicy, "policyText": this.privacyPolicySelected != "" ? this.privacyPolicySelected : this.defaultPrivacyPolicy
      }, {
        "storePolicyType": "3", "storePolicyTextType": this.storePoliciesGroup.value.termsOfUse, "policyText": this.termsOfUseSelected != "" ? this.termsOfUseSelected : this.defaultTermsOfUse
      });
      console.log(policyListObj);
      this.storeService.updateStorePolicies(policyListObj, this.teamStoreId).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, '');
            this.onSuccessResponse(response.data);
            const url = this.commonService.createUrl(this.router.url, '/privacysettings', 2);
            this.router.navigateByUrl(url);
          }
          else {
            this.commonService.openErrorSnackBar(response.message, '');
          }

        },
        (error) => {
          console.log(error);
        }
      );
    }

  }


  getStorePolicies() {
    this.storeService.getStore(this.teamStoreId).subscribe(
      (response) => {
        this.onSuccessResponse(response.data);
        console.log(this.thankYouMessage)
      },
      (error) => {
        console.log(error);

      }
    );
  }

  onSuccessResponse(response: any) {
    this.storePoliciesObj = response.policies;
    this.storePoliciesObj.forEach(item => {
      if (item.storePolicyType === 0) {
        this.thankYouMessage = item.storePolicyTextType;
        this.thankYouMessageSelected = item.policyText;
      }
      else if (item.storePolicyType === 1) {
        this.PackingSlipFooter = item.storePolicyTextType;
        this.PackingSlipFooterSelected = item.policyText;
      }
      else if (item.storePolicyType === 2) {
        this.privacyPolicy = item.storePolicyTextType;
        this.privacyPolicySelected = item.policyText;
      }
      else if (item.storePolicyType === 3) {
        this.termsOfUse = item.storePolicyTextType;
        this.termsOfUseSelected = item.policyText;
      }
    });
    this.storePoliciesGroup.setValue({
      thankYouMessage: stringify(this.thankYouMessage.storePolicyTextType),
      PackingSlipFooter: stringify(this.PackingSlipFooter.storePolicyTextType),
      privacyPolicy: stringify(this.privacyPolicy.storePolicyTextType),
      termsOfUse: stringify(this.termsOfUse.storePolicyTextType)
    });
    console.log(this.thankYouMessage)
  }

  onPackingSlipSelect() {
    this.selectedPolicy = "PackingSlipFooter";
    if (this.storePoliciesGroup.value.PackingSlipFooter == 0) {
      this.addPolicyFormGroup.controls['text'].setValue(this.defaultPackingSlipFooter);
      this.PackingSlipFooterSelected = this.defaultPackingSlipFooter;
      this.isEditable = false;
      this.toggleModal();
    }
    else {
      if (this.PackingSlipFooterSelected != null && this.PackingSlipFooterSelected != "") {
        this.addPolicyFormGroup.controls['text'].setValue(this.PackingSlipFooterSelected);
      }
      else {
        this.addPolicyFormGroup.controls['text'].setValue("");
      }

      this.isEditable = true;
      this.toggleModal();
    }
  }

  onThankYouMessageSelect() {
    this.selectedPolicy = "thankYouMessage";
    if (this.storePoliciesGroup.value.thankYouMessage == 0) {
      this.addPolicyFormGroup.controls['text'].setValue(this.defaultThankYouMessage);
      this.thankYouMessageSelected = this.defaultThankYouMessage;
      this.isEditable = false;
      this.toggleModal();
    }
    else {
      if (this.thankYouMessageSelected != null && this.thankYouMessageSelected != "") {
        this.addPolicyFormGroup.controls['text'].setValue(this.thankYouMessageSelected);
      }
      else {
        this.addPolicyFormGroup.controls['text'].setValue("");
      }
      this.isEditable = true;
      this.toggleModal();
    }
  }

  onPrivacyPolicySelect() {
    this.selectedPolicy = "privacyPolicy";
    if (this.storePoliciesGroup.value.privacyPolicy == 0) {
      this.addPolicyFormGroup.controls['text'].setValue(this.defaultPrivacyPolicy);
      this.privacyPolicySelected = this.defaultPrivacyPolicy;
      this.isEditable = false;
      this.toggleModal();
    }
    else {
      if (this.privacyPolicySelected != null && this.privacyPolicySelected != "") {
        this.addPolicyFormGroup.controls['text'].setValue(this.privacyPolicySelected);
      }
      else {
        this.addPolicyFormGroup.controls['text'].setValue("");
      }
      this.isEditable = true;
      this.toggleModal();
    }
  }

  onTermsOfUseSelect() {
    this.selectedPolicy = "termsOfUse";
    if (this.storePoliciesGroup.value.termsOfUse == 0) {
      this.addPolicyFormGroup.controls['text'].setValue(this.defaultTermsOfUse);
      this.termsOfUseSelected = this.defaultTermsOfUse;
      this.isEditable = false;
      this.toggleModal();
    }
    else {
      if (this.termsOfUseSelected != null && this.termsOfUseSelected != "") {
        this.addPolicyFormGroup.controls['text'].setValue(this.termsOfUseSelected);
      }
      else {
        this.addPolicyFormGroup.controls['text'].setValue("");
      }
      this.isEditable = true;
      this.toggleModal();
    }
  }

  toggleModal() {
    $('#addModal').modal('toggle');
  }


  savePolicyText() {
    switch (this.selectedPolicy) {
      case "thankYouMesage":
        this.thankYouMessageSelected = this.addPolicyFormGroup.value.text;
        this.thankYouMessage = 1;
        break;
      case "PackingSlipFooter":
        this.PackingSlipFooterSelected = this.addPolicyFormGroup.value.text;
        this.PackingSlipFooter = 1;
        break;
      case "privacyPolicy":
        this.privacyPolicySelected = this.addPolicyFormGroup.value.text;
        this.privacyPolicy = 1;
        break;
      case "termsOfUse":
        this.termsOfUseSelected = this.addPolicyFormGroup.value.text;
        this.termsOfUse = 1;
        break;
    }
    this.toggleModal();
  }

}

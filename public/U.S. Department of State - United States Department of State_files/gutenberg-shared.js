/**
* 
* Custom javascript shared between the Gutenberg editor and the visitor view.
*
*/


// The theme colors, as defined in the theme's functions.php file
const stateCoverBgColors = ['state-dark-blue', 'state-blue', 'state-white', 'state-dark-gray', 'state-link', 'state-gold', 'state-red', 'state-light-gray', 'state-gray'];

// Is the Gutenberg editor active?
function isGutenbergActive() {
    return typeof wp !== 'undefined' && typeof wp.blocks !== 'undefined';
}

// Return whether the URL is on a site we consider to be internal.
function isInternalSite(url) {

    if(typeof url === 'undefined') return;

    // Domain names that won't be considered external.
    const internalSites = ['state.gov', 'usembassy.gov', 'usmission.gov', 'america.gov', 'stateoig.gov', 'cstreetsandbox.com'];

    for(let i = 0; i < internalSites.length; i++) {
        if(url.includes(internalSites[i])) {
            return true;
        }
    }

    return false;
}

// Return whether the URL is on the same domain as this one.
function isThisSite(url) {
    var pageLocation = window.location;
    var URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/;
    var urlMatch = URL_HOST_PATTERN.exec(url) || [];

    if(urlMatch.length <= 2) {
        return false;
    }

    return !!(urlMatch[2] == pageLocation.host);
}

// Return which kind of external icon the element needs - light or dark.
// Returns "light", "default", or "none";
function stateExternalIconType(link_element) {

    if(!window.jQuery) {
        return;
    }

    if(typeof link_element === 'undefined' ||
       !link_element.host ) {
        return 'none';
    }

    if (isInternalSite(link_element.host) ||
        0 === link_element.host.indexOf('#') ||
        '' === link_element.host || 
        null === link_element.host  ||
        jQuery(link_element).find('span.icon-external').length !== 0 ||
        jQuery(link_element).find('span.icon-external__white').length !== 0 ||
        jQuery(link_element).parent().find('.twitter-card').length !== 0 ||
        jQuery(link_element).parent().hasClass('twitter-card') ||
        jQuery(link_element).hasClass('state-no-external-icon') ||
        jQuery(link_element).hasClass('icon') ||
        jQuery(link_element).hasClass('icon-twitter') ||
        jQuery(link_element).hasClass('external-link')) {
        return 'none';
    }

    if( jQuery(link_element).parent().hasClass('has-state-white-color') ||
        jQuery(link_element).closest('p').hasClass('has-state-white-color')) {
        return 'light';
    }

    return 'default';
}   

function stateAddLinkExtras(linkSelector) {

    // Extensions of documents - for getting file sizes and opening in a new tab.
    const documentExtensions = ['pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'];

    if(!window.jQuery) {
        return;
    }

    jQuery(linkSelector).each(function() {

        let link_element = this;
        let link_url = jQuery(link_element).attr('href');

        if(!link_url) return;

        // Don't update a link if that block is currently being edited.
        if(0 !== jQuery(link_element).parents(".is-selected").length) {
            return;
        }

        let file_type = link_url.substr(link_url.lastIndexOf('.') + 1).toLowerCase();
        let external_icon_type = stateExternalIconType(this);

        // Do not augment these links
        if(jQuery(link_element).hasClass('noextras') || jQuery(link_element).hasClass('link-url')) {
            return;
        }

        if ( 'pdf' === file_type && 0 === jQuery(link_element).find('.icon-pdf').length) {
            jQuery(this).attr('rel', 'noopener');
            jQuery(this).attr('target', '_blank');
            if(0 !== jQuery(this).find('.filesize').length) {
                jQuery(" <span class='icon-pdf'></span>").insertBefore(jQuery(this).find('.filesize').first());
            }
            else {
                jQuery(link_element).append(" <span class='icon-pdf'></span>");
            }
            jQuery(link_element).addClass('pdf');
        } else if( 'none' !== external_icon_type && 
                   0 === jQuery(link_element).find('.icon-pdf').length &&
                   0 === jQuery(link_element).find('.icon-external').length && 
                   0 === jQuery(link_element).find('.icon-external__white').length) {
            let external_link_icon = "<span class='icon-external'></span>";
            if ('light' === external_icon_type) {
                external_link_icon = "<span class='icon-external__white></span>";
            }
            jQuery(this).attr('rel', 'noopener');
            jQuery(this).attr('target', '_blank');
            jQuery(this).addClass('external-link');
            jQuery(this).append(external_link_icon);

            //If there was an external icon, stop here, we won't add a file size.
            return;
        }

        // If this link is on our site, include file size.
        if(isThisSite(link_url) && documentExtensions.includes(file_type) && 0 === jQuery(link_element).find('.filesize').length) {

            let wp_content_location = link_url.indexOf('wp-content');

            //Add file size
            if(0 === jQuery(link_element).find('.filesize').length && -1 !== wp_content_location) {

                jQuery.ajax({
                    url: location.protocol + '//' + location.host + '/wp-json/cdncached/filesize/',
                    data: { url: link_url.substring(wp_content_location + 11)},
                    success(file_size) {
                        if(file_size.length < 20) {
                            jQuery(link_element).append(" <span class='filesize'>" + file_size + "</span>");
                        }
                    }
                });
            }
        }
    });
}

// Options for running in the frontend, or editor.
if(isGutenbergActive()) {
    setInterval(function() {
        stateAddLinkExtras('.wp-block a');
    }, 5000);
} else {
    setTimeout(function() {
        stateAddLinkExtras('.has-blocks .entry-content a');
    }, 2000);
}

/* 
  On some blocks, the background is applied to a span inside the cover block.
  This results in the ANDI tool not seeing the same background a visitor sees. To correct this and make the ANDI tool
  output display as expected, copy the background styling to the block.
*/

// A timeout is needed here for this jQuery to work.
setTimeout(function() {

    if(window.jQuery) {

        // If the cover block has a background image, apply a default image underneath to the parent to make the ANDI tool register any image 
        jQuery('.wp-block-cover').has('.wp-block-cover__image-background').css('background', "url('/wp-content/themes/state/images/transparent-pixel.png') repeat").addClass('state-bg-added');

        // If the cover block has a gradient, apply a default image underneath to the parent to make the ANDI tool register any image 
        jQuery('.wp-block-cover').has('.has-background-gradient').css('background', "url('/wp-content/themes/state/images/transparent-pixel.png') repeat").addClass('state-bg-added');

        let coverBgSelector = '';

        // Loop through each background color to check for cover blocks with each background color
        for (var i = 0; i < stateCoverBgColors.length; i++) { 

            stateCoverBgColor = stateCoverBgColors[i];
            coverBgSelector   = '.has-' + stateCoverBgColor + '-background-color';

            jQuery('.wp-block-cover').has(coverBgSelector).each(function() {
                let link_element = this;
                bg_color = jQuery(this).find(coverBgSelector).first().css('background-color');
                jQuery(this).css('background-color', bg_color);

                // If the background has opacity, set the background as an image to make the ANDI tool read 'manual test needed' as expected
                opacity = jQuery(this).find(coverBgSelector).first().css('opacity');
                if( opacity < 1 ) {
                   jQuery(this).css('background', "url('/wp-content/themes/state/images/transparent-pixel.png') repeat");
                }
                
                jQuery(this).addClass('state-bg-added');

            });
        }

        // Legacy: sometime before November 2022, cover background styling was applied directly as an inline style, instead of adding either css or an image child element.
        // Copy the styling to cover element so the ANDI tool will recognize it.
        jQuery('.wp-block-cover').not('.state-bg-added').each(function() {
            
            // If there is not a background image applied directly to the div, copy over background data applied to the separate background element.
            if( 'none' == jQuery(this).css('background-image') ) {
                let background_element = jQuery(this).find('.wp-block-cover__background').get(0);
                // Copying over the general background element is riskier, though done for cases where there's a background gradient applied.
                jQuery(this).css('background', background_element.style.background);
                jQuery(this).css('background-color', background_element.style.backgroundColor);
                jQuery(this).css('background-image', background_element.style.backgroundImage);
                jQuery(this).addClass('state-bg-added');
            } 
        });

        // Give the home page top content block a transparent pixel background if there's an image background
        jQuery('.home-page-top-content-block').has('.state-block-bg-image').css('background', "url('/wp-content/themes/state/images/transparent-pixel.png') repeat").addClass('state-bg-added');
    }
}, 3000);



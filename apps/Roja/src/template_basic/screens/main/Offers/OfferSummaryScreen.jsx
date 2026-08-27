import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  Alert,
  Animated,
  Dimensions,
  Modal,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { domain, imgOfferApi } from '../../../../service/environment';
import appLog from '../../../../constants/logger';
import { useSelector } from 'react-redux';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import CommonFunction from '../../../../utill/CommonFunction';
import CloudImage from '../../../../utill/CloudImage';
import { downloadFile } from '../../../../utill/downloadFile';
import { content } from '../../../../constants/content';

const { width } = Dimensions.get('window');

/* -------------------------------------------------------------------------
 * Native savings table (purple header / green "You Pay" & "Savings" cols /
 * horizontal-scroll arrow + progress bar) — matches the "Sample Savings"
 * block in the purchase-summary screenshot.
 *
 * FIX: column widths are now computed dynamically from the actual header
 * + cell content for THIS table, instead of a single hardcoded 5-column
 * width map. That hardcoded map assumed every table was exactly
 * [name, avg, youPay, saved, percent] at fixed pixel widths, which is why
 * longer real-world labels ("Hydrochlorot Tab 25mg", "Cyclobenzapr Tab
 * 10mg", "Vitamin D Cap 50000...") were getting clipped with "..." even
 * though the row itself could still be scrolled horizontally — scrolling
 * moves the whole row, it doesn't reveal more of a single truncated cell.
 * ---------------------------------------------------------------------- */
const CustomNativeTable = ({ headers, rows }) => {
  const [scrollState, setScrollState] = useState({
    isAtStart: true,
    isAtEnd: false,
    progress: 0,
  });

  // Estimate a column's width from the longest header/cell text it holds,
  // clamped to a sane min/max so no column collapses or blows out.
  const CHAR_WIDTH = 7.2; // approx px per character at fontSize 11
  const MIN_COL_WIDTH = 70;
  const MAX_COL_WIDTH = 170;

  const colWidths = headers.map((header, idx) => {
    let longest = (header || '').length;
    rows.forEach((row) => {
      const len = (row[idx] || '').length;
      if (len > longest) longest = len;
    });
    const padding = idx === 0 ? 20 : 16; // first (name) column gets extra breathing room
    const estimated = Math.ceil(longest * CHAR_WIDTH) + padding;
    return Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, estimated));
  });

  const getColWidth = (index) => colWidths[index] || 80;

  const totalContentWidth = colWidths.reduce((sum, w) => sum + w, 0);
  const totalTableWidth = totalContentWidth + 24; // Including 12px padding on each side
  const tableVisibleWidth = width - 72;
  const needsScroll = totalTableWidth > tableVisibleWidth;

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const maxOffset = totalTableWidth - tableVisibleWidth;
    const isAtStart = offsetX <= 5;
    const isAtEnd = offsetX >= maxOffset - 5;
    const progress = maxOffset > 0 ? Math.min(1, offsetX / maxOffset) : 0;

    setScrollState({ isAtStart, isAtEnd, progress });
  };

  return (
    <View style={styles.tableContainer}>
      {needsScroll && !scrollState.isAtStart && (
        <View style={[styles.scrollIndicator, styles.scrollIndicatorLeft]}>
          <View style={styles.scrollIndicatorGradient}>
            <Icon name="chevron-left" size={20} color="#3F2B96" />
          </View>
        </View>
      )}

      {needsScroll && !scrollState.isAtEnd && (
        <View style={[styles.scrollIndicator, styles.scrollIndicatorRight]}>
          <View style={styles.scrollIndicatorGradient}>
            <Icon name="chevron-right" size={20} color="#3F2B96" />
          </View>
        </View>
      )}

      <ScrollView
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tableScrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.tableWrapper, { width: totalTableWidth }]}>
          <View style={styles.tableHeader}>
            {headers.map((header, idx) => (
              <Text
                key={idx}
                style={[
                  styles.tableHeaderText,
                  idx === 0
                    ? styles.tableHeaderLeft
                    : idx === headers.length - 1
                      ? styles.tableHeaderRight
                      : styles.tableHeaderCenter,
                  { width: getColWidth(idx) },
                ]}
                numberOfLines={2}
              >
                {header}
              </Text>
            ))}
          </View>

          {rows.map((row, idx) => (
            <View
              key={idx}
              style={[
                styles.tableRow,
                { backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' },
              ]}
            >
              {row.map((cell, cIdx) => (
                <Text
                  key={cIdx}
                  style={[
                    styles.tableCell,
                    cIdx === 0
                      ? styles.tableCellLeft
                      : cIdx === row.length - 1
                        ? styles.tableCellRight
                        : styles.tableCellCenter,
                    cIdx === 2 && styles.youPayText,
                    cIdx === 3 && styles.savingsAmountText,
                    cIdx === 4 && styles.savingsPercent,
                    { width: getColWidth(cIdx) },
                  ]}
                  numberOfLines={cIdx === 0 ? 2 : 1}
                >
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {needsScroll && (
        <View style={styles.scrollProgressContainer}>
          <View style={styles.scrollProgressTrack}>
            <View
              style={[
                styles.scrollProgressFill,
                { width: `${Math.min(100, scrollState.progress * 100)}%` },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const stripTagsToText = (html) =>
  (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const parseHtmlToSections = (html) => {
  if (!html) return [];

  const sections = [];
  // Split on <strong>...</strong> headers
  const headerRegex = /<strong>(.*?)<\/strong>/g;
  const parts = html.split(headerRegex);

  // parts alternates: [preamble, header1, body1, header2, body2, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].replace(/<[^>]*>/g, '').trim();
    const body = parts[i + 1] || '';

    // Pull out <li> items if this section has a list
    const liMatches = [...body.matchAll(/<li>(.*?)<\/li>/gs)];
    if (liMatches.length > 0) {
      const items = liMatches
        .map((m) => m[1].replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      if (items.length > 0) sections.push({ title, items });
    } else {
      // Plain paragraph section (e.g. Reimbursement)
      const text = body
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) sections.push({ title, text });
    }
  }
  return sections;
};

const getPreambleText = (html) => {
  if (!html) return '';
  const headerRegex = /<strong>/;
  const preambleHtml = html.split(headerRegex)[0] || '';
  return preambleHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/* -------------------------------------------------------------------------
 * Robust HTML Parsing for Multiple Tables and Mixed Content
 * ---------------------------------------------------------------------- */

const parseAllContent = (html) => {
  if (!html) return [];

  const segments = [];
  // Match tables while allowing for attributes like style/class
  const tableRegex = /<table[\s\S]*?>([\s\S]*?)<\/table>/gi;
  let match;
  let lastIndex = 0;

  while ((match = tableRegex.exec(html)) !== null) {
    // 1. Capture text before the table
    const preTable = html.substring(lastIndex, match.index).trim();
    // Only add if it contains non-tag text or meaningful markup
    if (preTable && stripTagsToText(preTable).trim()) {
      segments.push({ type: 'content', html: preTable });
    }

    const tableInner = match[1];
    const allRows = [];

    // 2. Extract every single <tr> within this table, handling attributes
    const trRegex = /<tr[\s\S]*?>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    while ((trMatch = trRegex.exec(tableInner)) !== null) {
      const cells = [];
      // 3. Extract every <td> or <th> within this row, handling attributes and nested tags
      const cellRegex = /<(td|th)[\s\S]*?>([\s\S]*?)<\/\1>/gi;
      let cellMatch;
      while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
        cells.push(stripTagsToText(cellMatch[2]));
      }
      if (cells.length > 0) allRows.push(cells);
    }

    // 4. Separate headers and rows (assume first row is header if data exists)
    if (allRows.length > 0) {
      segments.push({
        type: 'table',
        headers: allRows[0],
        rows: allRows.slice(1)
      });
    }

    lastIndex = tableRegex.lastIndex;
  }

  // 5. Capture remaining content after all tables
  const postTable = html.substring(lastIndex).trim();
  if (postTable && stripTagsToText(postTable).trim()) {
    segments.push({ type: 'content', html: postTable });
  }

  return segments;
};

const CombinedHtmlView = ({ html }) => {
  const segments = parseAllContent(html);

  if (segments.length === 0) {
    const plainText = stripTagsToText(html);
    return plainText ? <Text style={styles.benefitCardDescription}>{plainText}</Text> : null;
  }

  return (
    <View style={{ gap: 16 }}>
      {segments.map((seg, idx) => {
        if (seg.type === 'table') {
          return <CustomNativeTable key={idx} headers={seg.headers} rows={seg.rows} />;
        }

        // Segment contains text/lists - check for <strong> sections
        const sections = parseHtmlToSections(seg.html);
        const preamble = getPreambleText(seg.html);

        if (sections.length === 0) {
          const text = stripTagsToText(seg.html);
          return text ? <Text key={idx} style={styles.benefitCardDescription}>{text}</Text> : null;
        }

        return (
          <View key={idx}>
            {preamble ? <Text style={styles.benefitCardDescription}>{preamble}</Text> : null}
            {sections.map((s, sIdx) => (
              <View key={sIdx} style={styles.infoBlock}>
                <Text style={styles.infoBlockTitle}>{s.title}</Text>
                {s.items ? (
                  s.items.map((item, i) => (
                    <View key={i} style={styles.careItem}>
                      <View style={styles.careDot} />
                      <Text style={styles.careItemText}>{item}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.infoBlockText}>{s.text}</Text>
                )}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .split('Sample Savings')[0] // Truncate if it starts including table data as raw text
    .trim();
};

const FilterTag = ({ label, isActive, onPress, bgColor }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.filterTag,
          isActive && styles.filterTagActive,
          !isActive && { backgroundColor: bgColor || '#F1F5F9' },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterTagText, isActive && styles.filterTagTextActive]}>{label}</Text>
        {isActive && (
          <View style={styles.activeIndicator}>
            <Icon name="check" size={10} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Promo Code Card Component
const PromoCodeCard = ({ title, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    // Copy to clipboard logic would go here
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.promoCodeCard}>
      <View style={styles.promoCodeCardLeft}>
        <View>
          <Text style={styles.promoCodeCardTitle}>{title}</Text>
          <Text style={styles.promoCodeCardCode}>{code}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.promoCodeCopyButton, copied && styles.promoCodeCopied]}
        onPress={handleCopy}
        activeOpacity={0.7}
      >
        <Icon name={copied ? 'check' : 'copy'} size={16} color={copied ? '#22C55E' : '#5A21F1'} />
        <Text style={[styles.promoCodeCopyText, copied && styles.promoCodeCopiedText]}>
          {copied ? 'Copied' : 'Copy'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function OfferSummaryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { productData, selectedProducts = [], totalAmount = 0 } = route.params || {
    productData: null,
  };

  // appLog.error(productData);

  const sortedProducts = [...selectedProducts].sort((a, b) => {
    if (a.type === 'main') return -1;
    if (b.type === 'main') return 1;
    return 0;
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState(selectedProducts[0]?.id || 'virtual-telehealth-one');
  const scrollViewRef = useRef(null);
  const cardRefs = useRef({});

  const mainProduct = selectedProducts.find((p) => p.type === 'main') || selectedProducts[0];
  const { marketplaceFeature } = useSelector((state) => state.marketplace);
  const addOnProducts = selectedProducts.filter((p) => p.type === 'addon');

  function findFeature(id) {
    return marketplaceFeature?.find((item) => item?._id === id);
  }

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleBackPress = () => navigation.goBack();

  const shareOrder = () => {
    const productName = productData?.name || mainProduct?.title || 'Virtual Telehealth ++';
    Share.share({
      message: `I just enrolled in ${productName} with ${addOnProducts.length} add-ons for $${totalAmount}! 🏥💊`,
    });
  };

  const handleCallSupport = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/-/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make a call. Please dial ' + phoneNumber + ' manually.');
    });
  };

  const handleVisitPortal = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website. Please visit ' + url + ' manually.');
    });
  };

  const scrollToCard = (cardId) => {
    setActiveTab(cardId);

    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'linear', property: 'opacity' },
      update: { type: 'spring', springDamping: 0.7 },
      delete: { type: 'linear', property: 'opacity' },
    });

    if (cardRefs.current[cardId]) {
      setTimeout(() => {
        cardRefs.current[cardId].measureLayout(
          scrollViewRef.current,
          (x, y) => {
            const headerHeight = 20;
            const tabHeight = 70;
            const padding = 15;
            const scrollPosition = y - headerHeight - tabHeight + padding;

            scrollViewRef.current.scrollTo({ y: Math.max(0, scrollPosition), animated: true });
          },
          () => {
            const index = selectedProducts.findIndex((p) => p.id === cardId);
            const cardHeight = 500;
            const headerHeight = 280;
            const tabHeight = 70;
            const padding = 15;
            const scrollPosition = index * (cardHeight + 16) - headerHeight - tabHeight + padding;

            scrollViewRef.current.scrollTo({ y: Math.max(0, scrollPosition), animated: true });
          }
        );
      }, 100);
    }
  };



  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);
    const fileName = `${content.appName}.pdf`
    try {
      const { path } = await downloadFile(pdfFile, fileName, setProgress);
      console.log(path)
      // setLocalPath(path);
      Alert.alert('Download complete', `${fileName} has been saved.`);
    } catch (err) {
      console.error(err);
      Alert.alert('Download failed', err.message || 'Please try again.');
    } finally {
      setDownloading(false);
    }
    
  };

  const handleShareTerms = async () => {
    try {
      if (productData?.tcfile) {
        const fileUrl = imgOfferApi + productData.tcfile;
        await Share.share({
          message: `Check out the Terms of Use for ${productData.name}: ${fileUrl}`,
          url: fileUrl,
        });
      } else {

      }
    } catch (error) {
      appLog.error('Share error:', error);
      Alert.alert('Error', 'Unable to share.');
    }
  };

  const renderBenefitCard = (item, index) => {
    const dynamicFeature = findFeature(item.id);



    const details = {
      title: dynamicFeature?.name || item?.title,
      fullDescription: dynamicFeature ? stripHtml(dynamicFeature.long_description) : '',
      phone: dynamicFeature?.phone_number,
      portal: dynamicFeature?.member_portal_url,
      registration: dynamicFeature?.access_instructions,
      benefits_list: dynamicFeature?.benefits_list?.filter((b) => b && b.trim()) || [],
      promoCode: dynamicFeature?.promo_code ?? '',
      disclaimer: dynamicFeature?.disclaimer,
      disclosure: dynamicFeature?.disclosure,
      note: dynamicFeature?.insurance_instructions,
      activation_details: dynamicFeature?.activation_details

      // Sample savings tables and other properties are now parsed from HTML if present
    };

    if (!details.title) return null;

    const isMain = item.type === 'main';


    return (
      <View
        key={item.id}
        ref={(ref) => (cardRefs.current[item.id] = ref)}
        style={[styles.benefitCard, isMain && styles.benefitCardMain]}
        collapsable={false}
      >
        <View style={styles.benefitCardHeader}>
          <Text style={styles.benefitCardTitle}>{details.title}</Text>
        </View>

        <View style={styles.benefitCardBody}>
          {dynamicFeature?.long_description ? (
            <CombinedHtmlView html={dynamicFeature?.long_description} />
          ) : (
            <Text style={styles.benefitCardDescription}>{details?.fullDescription}</Text>
          )}

          {
            details?.activation_details && <View style={styles.promoSection}>
              <View style={styles.promoSectionHeader}>
                <Text style={[styles.infoBlockText, { fontSize: 13, lineHeight: 20 }]}>
                  {details.activation_details}
                </Text>
              </View>

            </View>
          }
          {details.benefits_list?.length > 0 && (
            <View style={styles.infoBlock}>
              <Text style={[styles.infoBlockTitle, { fontSize: 16, marginBottom: 8, marginTop: 20 }]}>Key Benefits</Text>
              {details.benefits_list.map((benefit, idx) => (
                <View key={idx} style={[styles.careItem, { marginBottom: 6 }]}>
                  <View style={[styles.careDot, { backgroundColor: '#5A21F1', width: 5, height: 5 }]} />
                  <Text style={[styles.careItemText, { fontSize: 13 }]}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ marginTop: 16 }}>
            {details.phone && (
              <TouchableOpacity
                style={[
                  styles.contactRow,
                  { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
                ]}
                onPress={() => handleCallSupport(details.phone)}
              >
                <Icon name="phone" size={18} color="#5A21F1" />
                <Text style={[styles.contactText, { fontSize: 14, fontWeight: '500' }]}>
                  {details.phone}
                </Text>
              </TouchableOpacity>
            )}

            {details.portal && (
              <TouchableOpacity
                style={[
                  styles.contactRow,
                  { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
                ]}
                onPress={() => handleVisitPortal(details.portal)}
              >
                <Icon name="globe" size={18} color="#5A21F1" />
                <Text style={[styles.contactText, { fontSize: 14, fontWeight: '500' }]}>
                  {details.portal}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Promo code card — dynamic code from feature */}
          {details.promoCode ? (
            <View style={styles.promoSection}>
              <View style={styles.promoSectionHeader}>
                <Text style={styles.promoSectionTitle}>Exclusive Promo Code</Text>
              </View>

              <PromoCodeCard title={details.title} code={details?.promoCode || ''} />

              <View style={styles.promoFooter}>
                <Icon name="info" size={14} color="#8B5CF6" />
                <Text style={styles.promoFooterText}>Use this code when booking for discounts</Text>
              </View>
            </View>
          ) : null}

          {details?.disclaimer && (
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclosureTitle}>Disclaimer</Text>
              <Text style={styles.disclaimerText}>{details.disclaimer}</Text>
            </View>
          )}

          {details?.disclosure && (
            <View style={styles.disclosureContainer}>
              <Text style={styles.disclosureTitle}>Disclosure</Text>
              <Text style={styles.disclosureText}>{details.disclosure}</Text>
            </View>
          )}

          {details?.note && (
            <View style={styles.disclaimerContainer}>

              <Text style={styles.disclaimerText}>{details?.note}</Text>
            </View>
          )}

          {isMain && details.phone && (
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => handleCallSupport(details.phone)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5A21F1', '#7C3AED']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>Call {details.phone} to Register</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderStickyTabs = () => {
    if (sortedProducts.length === 0) return null;

    return (
      <View style={styles.stickyTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          {sortedProducts.map((item) => {
            const dynamicFeature = findFeature(item.id);
            const label = dynamicFeature?.short_code || item.title || 'Service';
            const isActive = activeTab === item.id;

            return (
              <FilterTag
                key={item.id}
                label={label}
                isActive={isActive}
                onPress={() => scrollToCard(item.id)}
                bgColor={dynamicFeature?.bgcolor || '#F1F5F9'}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };


  const pdfFile = useMemo(() => {
    var url = CommonFunction.documentView(productData?.tcfile, storedata)
    return url

  }, [productData?.tcfile])

  console.log(pdfFile)

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Purchase Summary"
        showBack={true}
        onBackPress={handleBackPress}
        rightComponent={
          <TouchableOpacity onPress={shareOrder} style={styles.shareButton}>
            <Icon name="share-2" size={22} color="#0F172A" />
          </TouchableOpacity>
        }
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >
        {/* Success Header */}
        <View style={styles.successContainer}>
          <View
            style={[
              styles.successIconWrapper,
              { backgroundColor: productData?.bgcolor, borderColor: productData?.bgcolor },
            ]}
          >
            {productData?.image ? (
              // <Image source={{ uri: imgOfferApi + productData.image }} style={styles.successImage} resizeMode="contain" />
              <CloudImage
                style={styles.successImage}
                page='product'
                cloudSource={productData?.image} />
            ) : (
              <Image
                source={require('../../../../../assets/images/img/Telemedicine.png')}
                style={styles.successImage}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={styles.successTitle}>Enrollment Complete!</Text>
          <Text style={styles.successSubtitle}>
            Your {productData?.name} plan is now active.{' '}
            {productData?.short_description}
          </Text>

          <View style={styles.successStats}>
            <View style={styles.successStat}>
              <Text style={styles.successStatValue}>{productData?.features?.length ?? 0}</Text>
              <Text style={styles.successStatLabel}>Services</Text>
            </View>
            <View style={styles.successStatDivider} />
            <View style={styles.successStat}>
              <Text style={styles.successStatValue}>${totalAmount.toFixed(2)}</Text>
              <Text style={styles.successStatLabel}>Total Paid</Text>
            </View>
            <View style={styles.successStatDivider} />
            <View style={styles.successStat}>
              <Text style={styles.successStatValue}>24/7</Text>
              <Text style={styles.successStatLabel}>Support</Text>
            </View>
          </View>
        </View>

        {/* Sticky Tabs Header */}
        {renderStickyTabs()}

        {/* Benefits Cards */}
        <View style={styles.benefitsContainer}>{sortedProducts.map((item, index) => renderBenefitCard(item, index))}</View>




        {
          productData && productData?.tcfile !== 'null' && <View style={styles.termsLinkWrapper}>
            <TouchableOpacity
              style={styles.termsLinkContainer}
              onPress={() => setTermsModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.termsLinkText}>View Terms of Use</Text>
              <Icon name="chevron-right" size={16} color="#5A21F1" />
            </TouchableOpacity>
          </View>
        }


        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Terms of Use Modal */}
      <Modal animationType="slide" transparent={true} visible={termsModalVisible} onRequestClose={() => setTermsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms of Use</Text>
              <View style={styles.modalHeaderRight}>
                <TouchableOpacity onPress={handleShareTerms} style={styles.modalHeaderButton}>
                  <Icon name="share-2" size={20} color="#5A21F1" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setTermsModalVisible(false)}>
                  <Icon name="x" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>



            <View style={styles.modalContent}>
              {productData?.tcfile && pdfFile && (
                <Pdf
                  source={{ uri: pdfFile, cache: true }}
                  style={styles.pdf}
                  onLoadComplete={(numberOfPages, filePath) => {
                    appLog.error(`Number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page, numberOfPages) => {
                    appLog.error(`Current page: ${page}`);
                  }}
                  onError={(error) => {
                    appLog.error(error);
                  }}
                  onPressLink={(uri) => {
                    appLog.error(`Link pressed: ${uri}`);
                  }}
                />
              )}
            </View>

            <TouchableOpacity
              style={[styles.modalFooterButton, downloading && { opacity: 0.7 }]}
              onPress={handleDownload}
              activeOpacity={0.8}
              disabled={downloading}
            >
              <LinearGradient
                colors={['#5A21F1', '#7C3AED']}
                style={styles.modalFooterGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalFooterText}>
                  {downloading ? `Downloading...${progress}` : 'Download PDF'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  shareButton: { padding: 4 },

  successContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  successIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  successImage: { width: 40, height: 40 },
  successTitle: { fontWeight: '600', fontSize: 20, color: '#1B1B1B', marginBottom: 4 },
  successSubtitle: {
    fontWeight: '400',
    fontSize: 14,
    color: '#676767',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  successStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  successStat: { flex: 1, alignItems: 'center' },
  successStatValue: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  successStatLabel: { fontSize: 10, color: '#64748B', marginTop: 2 },
  successStatDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },

  // Sticky Tabs
  stickyTabsContainer: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    width: '100%',
    minHeight: 60,
  },
  tabsScrollContent: { alignItems: 'center', paddingVertical: 4, gap: 8 },

  // Filter Tag Styles
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  filterTagActive: { backgroundColor: '#3F2B96' },
  filterTagText: { fontSize: 13, fontWeight: '500', color: '#475569' },
  filterTagTextActive: { color: '#FFFFFF' },
  activeIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  benefitsContainer: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },

  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 4,
  },
  benefitCardMain: { borderWidth: 2, borderColor: '#5A21F1' },
  benefitCardHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  benefitCardTitle: { fontWeight: '700', fontSize: 24, color: '#1B1B1B', lineHeight: 30 },
  benefitCardBody: { paddingHorizontal: 20, paddingVertical: 16 },
  benefitCardDescription: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 14 },

  infoBlock: { marginBottom: 14 },
  infoBlockTitle: { fontWeight: '700', fontSize: 15, color: '#1B1B1B', marginBottom: 6 },
  infoBlockText: { fontSize: 13, color: '#475569', lineHeight: 20 },

  careItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 2, paddingLeft: 4 },
  careDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#5A21F1', marginTop: 6, marginRight: 8, flexShrink: 0 },
  careItemText: { fontSize: 12, color: '#475569', lineHeight: 18, flex: 1 },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  contactText: { fontSize: 14, color: '#5A21F1', fontWeight: '500' },

  // Promo Code Styles
  promoSection: {
    marginVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  promoSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  promoSectionTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  promoCodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  promoCodeCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  promoCodeCardTitle: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  promoCodeCardCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  promoCodeCopyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  promoCodeCopied: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
  promoCodeCopyText: { fontSize: 12, fontWeight: '600', color: '#5A21F1' },
  promoCodeCopiedText: { color: '#22C55E' },
  promoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  promoFooterText: { fontSize: 11, color: '#6B7280', fontWeight: '400' },
  promoNote: { fontSize: 12, color: '#64748B', lineHeight: 18, marginTop: 4, marginBottom: 10 },

  // Table Styles
  tableContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  tableScrollContent: { flexGrow: 1, paddingVertical: 1, paddingBottom: 20 },
  tableWrapper: { backgroundColor: '#FFFFFF' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3F2B96',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },
  tableHeaderText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  tableHeaderLeft: { textAlign: 'left', paddingLeft: 4 },
  tableHeaderCenter: { textAlign: 'center' },
  tableHeaderRight: { textAlign: 'right', paddingRight: 4 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    minHeight: 48,
    alignItems: 'center',
  },
  tableCell: { fontSize: 11, color: '#334155' },
  tableCellLeft: { textAlign: 'left', paddingLeft: 4, fontWeight: '500' },
  tableCellCenter: { textAlign: 'center' },
  tableCellRight: { textAlign: 'right', paddingRight: 4 },
  youPayText: { color: '#0F172A', fontWeight: '600' },
  savingsAmountText: { color: '#22C55E', fontWeight: '600' },
  savingsPercent: { color: '#22C55E', fontWeight: '700', fontSize: 12 },

  // Scroll Indicators
  scrollIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  scrollIndicatorLeft: { left: 0 },
  scrollIndicatorRight: { right: 0 },
  scrollIndicatorGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  scrollProgressContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  scrollProgressTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  scrollProgressFill: { height: '100%', backgroundColor: '#3F2B96', borderRadius: 2 },

  savingsSection: { marginTop: 12, marginBottom: 12 },
  savingsSectionTitle: { fontWeight: '700', fontSize: 15, color: '#1B1B1B', marginBottom: 8 },

  noteText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  disclaimerContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  disclaimerText: { fontSize: 12, color: '#92400E', lineHeight: 18, fontWeight: '500' },

  disclosureContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  disclosureTitle: { fontSize: 13, fontWeight: '700', color: '#92400E', marginBottom: 4 },
  disclosureText: { fontSize: 12, color: '#78350F', lineHeight: 18 },

  ctaButton: {
    marginTop: 16,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#2B3582',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaGradient: { height: 50, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontWeight: '600', fontSize: 16, color: '#FFFFFF' },

  termsLinkWrapper: { marginHorizontal: 16, marginTop: 8, marginBottom: 4 },
  termsLinkContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
  termsLinkText: { fontSize: 14, fontWeight: '500', color: '#5A21F1', textDecorationLine: 'underline' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width - 32,
    height: '80%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  modalHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalHeaderButton: { padding: 4 },
  modalCloseButton: { padding: 4 },
  modalContent: { flex: 1, paddingHorizontal: 20, paddingVertical: 8 },
  pdf: {
    flex: 1,
    width: width - 72,
    height: 400,
    backgroundColor: '#F8FAFC',
  },
  modalContentContainer: { paddingBottom: 16 },
  modalText: { fontSize: 13, lineHeight: 22, color: '#334155', fontWeight: '400' },
  modalFooterButton: { marginHorizontal: 20, borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  modalFooterGradient: { alignItems: 'center', justifyContent: 'center', height: 50, },
  modalFooterText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  bottomPadding: { height: 20 },
});
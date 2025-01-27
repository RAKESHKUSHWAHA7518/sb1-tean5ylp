import React from 'react';
import { BusinessFormData } from '../types';

interface PDFTemplateProps {
  data: BusinessFormData;
}

export const PDFTemplate = React.forwardRef<HTMLDivElement, PDFTemplateProps>(
  ({ data }, ref) => {
    const labelStyle = {
      display: 'inline-block',
      minWidth: '140px',
      fontWeight: 'normal' as const,
      marginRight: '4px'
    };

    const valueStyle = {
      display: 'inline-block',
      fontWeight: 'normal' as const,
      borderBottom: '1px dotted #999',
      minWidth: '100px',
      paddingLeft: '4px'
    };

    return (
      <div
        ref={ref}
        data-pdf-container
        style={{
          width: '816px',
          height: '1250px', // Increased height to match the form
          backgroundColor: 'white',
          position: 'fixed',
          left: '-9999px',
          top: 0,
          fontFamily: 'Times New Roman, serif',
          fontSize: '12px',
          lineHeight: '1.4',
          color: '#000',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with Logo and Title */}
        <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'flex-start' }}>
          <img 
            src="https://i.imgur.com/0TfX0Q8.png" 
            alt="Operating in the Black"
            style={{ width: '150px', height: 'auto' }}
          />
          <div style={{ 
            flex: 1, 
            textAlign: 'right',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            <div>SEND WITH 6 MONTHS MERCHANT STATEMENT</div>
            <div>AND 6 MONTHS BANK STATEMENTS</div>
            <div>EMAIL: <a href="mailto:daniel@operatingintheblack.com" style={{ color: 'blue', textDecoration: 'underline' }}>daniel@operatingintheblack.com</a></div>
          </div>
        </div>

        {/* Business Information Section */}
        <div style={{ border: '1px solid black', marginBottom: '10px' }}>
          <div style={{ borderBottom: '1px solid black', padding: '2px 5px', backgroundColor: '#fff' }}>
            <div style={{ fontWeight: 'bold' }}>BUSINESS INFORMATION</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black', width: '50%' }}>
                  <span style={labelStyle}>Legal/Corporate Name:</span>
                  <span style={valueStyle}>{data.legalName}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>DBA:</span>
                  <span style={valueStyle}>{data.dba}</span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Physical Address:</span>
                  <span style={valueStyle}>{data.address}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>City:</span>
                          <span style={valueStyle}>{data.city}</span>
                        </td>
                        <td style={{ width: '25%' }}>
                          <span style={labelStyle}>State:</span>
                          <span style={valueStyle}>{data.state}</span>
                        </td>
                        <td style={{ width: '25%' }}>
                          <span style={labelStyle}>Zip:</span>
                          <span style={valueStyle}>{data.zip}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Telephone #:</span>
                  <span style={valueStyle}>{data.telephone}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Fax #:</span>
                          <span style={valueStyle}>{data.fax}</span>
                        </td>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Federal Tax ID:</span>
                          <span style={valueStyle}>{data.federalTaxId}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Date Business Started:</span>
                  <span style={valueStyle}>{data.dateStarted}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Length of Ownership:</span>
                          <span style={valueStyle}>{data.lengthOwnership}</span>
                        </td>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Website:</span>
                          <span style={valueStyle}>{data.website}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* NEW ROW: Email Address */}
              <tr>
                <td colSpan={2} style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Email Address:</span>
                  <span style={valueStyle}>{data.email}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <div style={{ marginBottom: '4px' }}>Type of Entity (circle one):</div>
                  <div 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginLeft: '8px',
                      height: '24px'
                    }}
                  >
                    {[
                      { label: 'Sole Proprietorship', value: 'soleproprietorship' },
                      { label: 'Partnership', value: 'partnership' },
                      { label: 'Corporation', value: 'corporation' },
                      { label: 'LLC', value: 'llc' },
                      { label: 'Other', value: 'other' }
                    ].map(({ label, value }) => {
                      const isSelected = (data.entityType || '').toLowerCase() === value;
                      return (
                        <div 
                          key={label} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {/* Circle */}
                          <div
                            style={{
                              width: '14px',
                              height: '14px',
                              border: '1px solid black',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px'
                            }}
                          >
                            {isSelected ? '●' : ''}
                          </div>
                          <span style={{ fontSize: '12px' }}>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <div style={{ marginBottom: '4px' }}>Type of Business (circle all that apply):</div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: '8px',
                    height: '24px'
                  }}>
                    {[
                      { label: 'Retail', width: '14px' },
                      { label: 'MO/TO', width: '14px' },
                      { label: 'Wholesale', width: '14px' },
                      { label: 'Restaurant', width: '14px' },
                      { label: 'Supermarket', width: '14px' },
                      { label: 'Other', width: '14px' }
                    ].map(({ label, width }) => (
                      <div key={label} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}>
                        <span style={{ 
                          display: 'inline-block',
                          width: width,
                          height: '14px',
                          border: '1px solid black',
                          borderRadius: '50%',
                          position: 'relative',
                          top: '0px'
                        }}>
                          {data.businessTypes.includes(label.toLowerCase()) ? (
                            <span style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: '10px'
                            }}>●</span>
                          ) : null}
                        </span>
                        <span style={{ fontSize: '12px' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Product/Service Sold:</span>
                  <span style={valueStyle}>{data.productService}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Merchant/Owner Information */}
        <div style={{ border: '1px solid black', marginBottom: '10px' }}>
          <div style={{ borderBottom: '1px solid black', padding: '2px 5px', backgroundColor: '#fff' }}>
            <div style={{ fontWeight: 'bold' }}>MERCHANT/OWNER INFORMATION</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black', width: '60%' }}>
                  <span style={labelStyle}>Corporate Officer/Owner Name:</span>
                  <span style={valueStyle}>{data.ownerName}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Title:</span>
                  <span style={valueStyle}>{data.title}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Ownership %:</span>
                  <span style={valueStyle}>{data.ownershipPercentage}</span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Home Address:</span>
                  <span style={valueStyle}>{data.ownerAddress}</span>
                </td>
                <td colSpan={2} style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>City:</span>
                          <span style={valueStyle}>{data.ownerCity}</span>
                        </td>
                        <td style={{ width: '25%' }}>
                          <span style={labelStyle}>State:</span>
                          <span style={valueStyle}>{data.ownerState}</span>
                        </td>
                        <td style={{ width: '25%' }}>
                          <span style={labelStyle}>Zip:</span>
                          <span style={valueStyle}>{data.ownerZip}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>SSN:</span>
                  <span style={valueStyle}>{data.ssn}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Date of Birth:</span>
                  <span style={valueStyle}>{data.dateOfBirth}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Home #:</span>
                          <span style={valueStyle}>{data.homePhone}</span>
                        </td>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Cell #:</span>
                          <span style={valueStyle}>{data.cellPhone}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Partner Information */}
        <div style={{ border: '1px solid black', marginBottom: '10px' }}>
          <div style={{ borderBottom: '1px solid black', padding: '2px 5px', backgroundColor: '#fff' }}>
            <div style={{ fontWeight: 'bold' }}>PARTNER INFORMATION</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black', width: '60%' }}>
                  <span style={labelStyle}>Partner Name:</span>
                  <span style={valueStyle}>{data.partnerName}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Title:</span>
                  <span style={valueStyle}>{data.partnerTitle}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Ownership %:</span>
                  <span style={valueStyle}>{data.partnerOwnershipPercentage}</span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Home Address:</span>
                  <span style={valueStyle}>{data.partnerAddress}</span>
                </td>
                <td colSpan={2} style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>City:</span>
                          <span style={valueStyle}>{data.partnerCity}</span>
                        </td>
                        <td style={{ width: '25%' }}>
                          <span style={labelStyle}>State:</span>
                          <span style={valueStyle}>{data.partnerState}</span>
                        </td>
                        <td style={{ width: '25%' }}>
                          <span style={labelStyle}>Zip:</span>
                          <span style={valueStyle}>{data.partnerZip}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>SSN:</span>
                  <span style={valueStyle}>{data.partnerSsn}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Date of Birth:</span>
                  <span style={valueStyle}>{data.partnerDateOfBirth}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Home #:</span>
                          <span style={valueStyle}>{data.partnerHomePhone}</span>
                        </td>
                        <td style={{ width: '50%' }}>
                          <span style={labelStyle}>Cell #:</span>
                          <span style={valueStyle}>{data.partnerCellPhone}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Business Property Information */}
        <div style={{ border: '1px solid black', marginBottom: '10px' }}>
          <div style={{ borderBottom: '1px solid black', padding: '2px 5px', backgroundColor: '#fff' }}>
            <div style={{ fontWeight: 'bold' }}>BUSINESS PROPERTY INFORMATION</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black', width: '50%' }}>
                  <span style={labelStyle}>Business Landlord or Business Mortgage Bank:</span>
                  <span style={valueStyle}>{data.businessPropertyInfo.landlordName}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black', width: '30%' }}>
                  <span style={labelStyle}>Contact Name and/or Account #:</span>
                  <span style={valueStyle}>{data.businessPropertyInfo.landlordContact}</span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Phone #:</span>
                  <span style={valueStyle}>{data.businessPropertyInfo.landlordPhone}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Business Trade References */}
        <div style={{ border: '1px solid black', marginBottom: '10px' }}>
          <div style={{ borderBottom: '1px solid black', padding: '2px 5px', backgroundColor: '#fff' }}>
            <div style={{ fontWeight: 'bold' }}>BUSINESS TRADE REFERENCES</div>
            <div style={{ fontSize: '10px', fontStyle: 'italic' }}>(Please list at least 3 trade suppliers. Please attach any additional references on a separate page.)</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {data.businessTradeReferences.map((ref, index) => (
                <tr key={index}>
                  <td style={{ padding: '4px 5px', border: '1px solid black', width: '33%' }}>
                    <span style={labelStyle}>Business Name:</span>
                    <span style={valueStyle}>{ref.businessName}</span>
                  </td>
                  <td style={{ padding: '4px 5px', border: '1px solid black', width: '33%' }}>
                    <span style={labelStyle}>Contact Name and/or Account #:</span>
                    <span style={valueStyle}>{ref.contactNameOrAccountNumber}</span>
                  </td>
                  <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                    <span style={labelStyle}>Phone #:</span>
                    <span style={valueStyle}>{ref.phone}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agent Use Only */}
        <div style={{ border: '1px solid black', marginBottom: '10px' }}>
          <div style={{ borderBottom: '1px solid black', padding: '2px 5px', backgroundColor: '#fff' }}>
            <div style={{ fontWeight: 'bold' }}>AGENT USE ONLY</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black', width: '50%' }}>
                  <span style={labelStyle}>Processing Company:</span>
                  <span style={valueStyle}></span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black', width: '30%' }}>
                  <span style={labelStyle}>Number of Terminals:</span>
                  <span style={valueStyle}></span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Terminal Type:</span>
                  <span style={valueStyle}></span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Requested Advance Amount:</span>
                  <span style={valueStyle}></span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Requested Daily Withholding:</span>
                  <span style={valueStyle}></span>
                </td>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Monthly Volume:</span>
                  <span style={valueStyle}></span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Prior/Current Cash Advance Company (if applicable):</span>
                  <span style={valueStyle}></span>
                </td>
                <td colSpan={2} style={{ padding: '4px 5px', border: '1px solid black' }}>
                  <span style={labelStyle}>Balance:</span>
                  <span style={valueStyle}></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Authorization Text */}
        <div style={{ fontSize: '10px', marginBottom: '20px' }}>
          Applicant authorizes company, its assigns, agents, banks or financial institutions to obtain an investigative or consumer report from a credit
          bureau or a credit agency and to investigate the references given or any other statement or data obtained from applicant.
        </div>

        {/* Signature Line */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ borderTop: '1px solid black', width: '40%', textAlign: 'center' }}>
            <div style={{ marginTop: '4px' }}>
              <span style={labelStyle}>Applicant's Signature:</span>
              <span style={valueStyle}>{data.signature}</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid black', width: '40%', textAlign: 'center' }}>
            <div style={{ marginTop: '4px' }}>
              <span style={labelStyle}>Date:</span>
              <span style={valueStyle}>{data.authorizationDate}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
